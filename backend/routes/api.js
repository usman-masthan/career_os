const router = require('express').Router();
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { supabase } = require('../supabaseClient');
const { getVisibleSkillEvidence } = require('../services/skillEvidence');
const { createContactHandler } = require('../controllers/contact');
const { validateAnalyticsEvent } = require('../controllers/analytics');

const requireSupabase = (res) => {
    if (!supabase) {
        res.status(500).json({
            error: { code: 'SERVICE_UNAVAILABLE', message: 'Service is temporarily unavailable.' },
        });
        return false;
    }

    return true;
};

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${req.get('origin') || 'no-origin'}:${ipKeyGenerator(req.ip)}`,
    handler: (req, res) => res.status(429).json({
        error: { code: 'RATE_LIMITED', message: 'Too many contact attempts. Please try again later.' },
    }),
});

const analyticsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

const databaseFailure = (res, operation, error) => {
    console.error(`Supabase ${operation} failed`, error);
    return res.status(500).json({
        error: { code: 'DATABASE_ERROR', message: 'Unable to complete the request.' },
    });
};

const publicTables = {
    profile: { table: 'profile', columns: 'id,slug,display_name,headline,bio,location,avatar_url,website_url,visibility,featured,verification_status,verification_url,source_platform,external_identifier,created_at,updated_at,email,linkedin_url,github_url,availability,initials', order: 'created_at', ascending: true },
    projects: { table: 'projects', order: 'started_at', ascending: false },
    skills: { table: 'skills', order: 'name', ascending: true },
    experiences: { table: 'experiences', order: 'started_at', ascending: false },
    education: { table: 'education', order: 'started_at', ascending: false },
    credentials: { table: 'credentials', order: 'issued_at', ascending: false },
    research: { table: 'research', order: 'started_at', ascending: false },
    achievements: { table: 'achievements', order: 'achieved_at', ascending: false },
    publications: { table: 'publications', order: 'published_at', ascending: false },
};

const readPublicCollection = async (res, resource) => {
    if (!requireSupabase(res)) return;
    const config = publicTables[resource];
    const { data, error } = await supabase.from(config.table).select(config.columns || '*')
        .order(config.order, { ascending: config.ascending, nullsFirst: false });
    if (error) return databaseFailure(res, `${resource} read`, error);
    return res.json(data);
};

const readPublicCertifications = async (res) => {
    if (!requireSupabase(res)) return;
    const { data, error } = await supabase.from('credentials')
        .select('id,name,issuer,issued_at,expires_at,credential_url,visibility,featured,verification_status,verification_url,source_platform,external_identifier,display_order,created_at,updated_at')
        .eq('visibility', 'public')
        .order('display_order', { ascending: true })
        .order('issued_at', { ascending: false, nullsFirst: false });
    if (error) return databaseFailure(res, 'certifications read', error);
    return res.json(data);
};

router.route('/projects').get(async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });

    if (error) {
        return databaseFailure(res, 'projects read', error);
    }

    return res.json(data);
});

router.get('/projects/:slug', async (req, res) => {
    if (!requireSupabase(res)) return;
    const { data, error } = await supabase.from('projects').select(`
        *,
        project_skills(context, featured, skills(id, slug, name, category, verification_status, verification_url)),
        project_evidence(id, title, description, evidence_type, url, occurred_at, verification_status, verification_url),
        project_media(id, media_type, title, caption, storage_path, external_url, alt_text, display_order, verification_status),
        achievements(id, title, description, achieved_at, verification_status, verification_url)
    `).eq('slug', req.params.slug)
        .order('display_order', { referencedTable: 'project_media', ascending: true })
        .maybeSingle();
    if (error) return databaseFailure(res, 'project read', error);
    if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
    return res.json(data);
});

router.route('/skills').get(async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { data, error } = await supabase.from('skills').select('*').order('name', { ascending: true });

    if (error) {
        return databaseFailure(res, 'skills read', error);
    }

    return res.json(data);
});

for (const resource of ['profile', 'experiences', 'education', 'credentials', 'research', 'achievements', 'publications']) {
    router.get(`/${resource}`, (req, res) => readPublicCollection(res, resource));
}

router.get('/certifications', (req, res) => readPublicCertifications(res));

router.get('/home', async (req, res) => {
    if (!requireSupabase(res)) return;
    const queries = [
        supabase.from('site_content').select('content').eq('page_key', 'home').single(),
        supabase.from('profile').select(publicTables.profile.columns).eq('featured', true).limit(1).maybeSingle(),
        supabase.from('projects').select('*').eq('featured', true).order('display_order').limit(3),
        supabase.from('skills').select('*').eq('featured', true).order('display_order').order('name').limit(12),
        supabase.from('credentials').select('*').eq('visibility', 'public').eq('featured', true).order('display_order').limit(4),
        supabase.from('achievements').select('*').eq('featured', true).order('display_order').limit(4),
        supabase.from('experiences').select('*').eq('featured', true).order('display_order').limit(3),
        supabase.from('research').select('*').eq('featured', true).order('display_order').limit(2),
    ];
    const results = await Promise.all(queries);
    const failed = results.find((result) => result.error);
    if (failed) return databaseFailure(res, 'home aggregate read', failed.error);
    const [site, profile, projects, skills, certifications, achievements, experiences, research] = results;
    return res.json({
        content: site.data.content, profile: profile.data, projects: projects.data,
        skills: skills.data, certifications: certifications.data,
        achievements: achievements.data, experiences: experiences.data, research: research.data,
    });
});

router.route('/skills/:slug/evidence').get(async (req, res) => {
    try {
        const data = await getVisibleSkillEvidence(req.params.slug);
        if (!data) return res.status(404).json({ error: 'Visible skill not found' });
        return res.json(data);
    } catch (error) {
        return databaseFailure(res, 'skill evidence read', error);
    }
});

router.get('/site-content/:pageKey?', async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('page_key', req.params.pageKey || 'home')
        .single();

    if (error) {
        return databaseFailure(res, 'site content read', error);
    }

    return res.json(data.content);
});

router.route('/contact').post(contactLimiter, async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    return createContactHandler(supabase)(req, res);
});

router.post('/analytics/events', analyticsLimiter, async (req, res) => {
    if (!requireSupabase(res)) return;
    const event = validateAnalyticsEvent(req.body);
    if (!event) return res.status(422).json({ error: { code: 'INVALID_EVENT', message: 'Invalid analytics event.' } });
    const { error } = await supabase.from('analytics_events').insert(event);
    if (error) return databaseFailure(res, 'analytics insert', error);
    return res.status(202).end();
});

module.exports = router;
