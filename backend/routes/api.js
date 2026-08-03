const router = require('express').Router();
const { supabase } = require('../supabaseClient');

const requireSupabase = (res) => {
    if (!supabase) {
        res.status(500).json({
            error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env',
        });
        return false;
    }

    return true;
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

    const { error } = await supabase.from('contacts').insert([{ name, email, message }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.json('Contact form submitted!');
});

module.exports = router;