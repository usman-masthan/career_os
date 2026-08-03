const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { supabase, createAuthenticatedClient } = require('../supabaseClient');
const { getVisibleSkillEvidence } = require('../services/skillEvidence');

const requireSupabase = (res) => {
    if (!supabase) {
        res.status(500).json({
            error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env',
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
        return res.status(400).json({ error: error.message });
    }

    return res.json(data);
});

router.route('/skills').get(async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { data, error } = await supabase.from('skills').select('*').order('name', { ascending: true });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.json(data);
});

router.route('/skills/:slug/evidence').get(async (req, res) => {
    try {
        const data = await getVisibleSkillEvidence(req.params.slug);
        if (!data) return res.status(404).json({ error: 'Visible skill not found' });
        return res.json(data);
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
        return res.status(400).json({ error: error.message });
    }

    return res.json(data.content);
});

router.route('/contact').post(async (req, res) => {
    if (!requireSupabase(res)) {
        return;
    }

    const { name, email, message } = req.body;
    if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100
        || typeof email !== 'string' || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)
        || typeof message !== 'string' || message.trim().length < 1 || message.length > 5000) {
        return res.status(422).json({ error: 'Invalid contact submission' });
    }

    const { error } = await supabase.from('contacts').insert([{
        name: name.trim(), email: email.trim().toLowerCase(), message: message.trim(),
    }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.json('Contact form submitted!');
});

router.put('/admin/site-content/:pageKey', ownerWriteLimiter, requireOwner, async (req, res) => {
    if (!req.body || typeof req.body.content !== 'object' || Array.isArray(req.body.content)) {
        return res.status(422).json({ error: 'content must be a JSON object' });
    }
    const { data, error } = await req.supabase.from('site_content')
        .update({ content: req.body.content, updated_at: new Date().toISOString() })
        .eq('page_key', req.params.pageKey).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
});

module.exports = router;
