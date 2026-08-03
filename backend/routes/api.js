const router = require('express').Router();
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { supabase, createAuthenticatedClient } = require('../supabaseClient');
const { getVisibleSkillEvidence } = require('../services/skillEvidence');
const { createContactHandler } = require('../controllers/contact');

const requireSupabase = (res) => {
    if (!supabase) {
        res.status(500).json({
            error: { code: 'SERVICE_UNAVAILABLE', message: 'Service is temporarily unavailable.' },
        });
        return false;
    }

    return true;
};

const ownerEmails = new Set(
    (process.env.PORTFOLIO_OWNER_EMAILS || '')
        .split(',').map((email) => email.trim().toLowerCase()).filter(Boolean),
);

const ownerWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

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

const databaseFailure = (res, operation, error) => {
    console.error(`Supabase ${operation} failed`, error);
    return res.status(500).json({
        error: { code: 'DATABASE_ERROR', message: 'Unable to complete the request.' },
    });
};

const requireOwner = async (req, res, next) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const client = createAuthenticatedClient(token);
    if (!client) return res.status(401).json({ error: 'Authentication required' });

    const { data: { user }, error } = await client.auth.getUser(token);
    const isOwner = user && (
        user.app_metadata?.portfolio_owner === true
        || ownerEmails.has((user.email || '').toLowerCase())
    );
    if (error || !isOwner) return res.status(403).json({ error: 'Portfolio owner access required' });

    req.supabase = client;
    req.user = user;
    return next();
};

router.route('/projects').get(async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

    if (error) {
        return databaseFailure(res, 'projects read', error);
    }

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

router.route('/skills/:slug/evidence').get(async (req, res) => {
    try {
        const data = await getVisibleSkillEvidence(req.params.slug);
        if (!data) return res.status(404).json({ error: 'Visible skill not found' });
        return res.json(data);
    } catch (error) {
        return databaseFailure(res, 'skill evidence read', error);
    }
});

router.route('/site-content').get(async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('page_key', 'home')
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

router.put('/admin/site-content/:pageKey', ownerWriteLimiter, requireOwner, async (req, res) => {
    if (!req.body || typeof req.body.content !== 'object' || Array.isArray(req.body.content)) {
        return res.status(422).json({ error: 'content must be a JSON object' });
    }
    const { data, error } = await req.supabase.from('site_content')
        .update({ content: req.body.content, updated_at: new Date().toISOString() })
        .eq('page_key', req.params.pageKey).select().single();
    if (error) return databaseFailure(res, 'site content update', error);
    return res.json(data);
});

module.exports = router;
