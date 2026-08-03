const CONTACT_FIELDS = new Set(['name', 'email', 'message', 'website']);

const validationError = (fields) => ({
    error: {
        code: 'VALIDATION_ERROR',
        message: 'The contact submission is invalid.',
        fields,
    },
});

const validateContact = (body) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { error: validationError({ body: 'Must be a JSON object.' }) };
    }

    const unknown = Object.keys(body).filter((key) => !CONTACT_FIELDS.has(key));
    const fields = {};
    if (unknown.length) fields.body = 'Contains unknown fields.';

    const limits = {
        name: [2, 100],
        email: [5, 254],
        message: [10, 5000],
    };

    const normalized = {};
    for (const [field, [minimum, maximum]] of Object.entries(limits)) {
        if (typeof body[field] !== 'string') {
            fields[field] = 'Must be a string.';
            continue;
        }
        const value = body[field].trim();
        if (value.length < minimum || value.length > maximum) {
            fields[field] = `Must be between ${minimum} and ${maximum} characters.`;
        }
        normalized[field] = field === 'email' ? value.toLowerCase() : value;
    }

    if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
        fields.email = 'Must be a valid email address.';
    }

    if (body.website !== undefined && typeof body.website !== 'string') {
        fields.website = 'Must be a string.';
    }

    if (Object.keys(fields).length) return { error: validationError(fields) };
    return { value: normalized, isBot: Boolean(body.website?.trim()) };
};

const createContactHandler = (supabase) => async (req, res) => {
    const result = validateContact(req.body);
    if (result.error) return res.status(422).json(result.error);

    // Silently accept honeypot submissions so automated senders cannot tune
    // their payloads around the anti-spam control. Nothing is persisted.
    if (result.isBot) return res.status(202).json({ message: 'Your message has been received.' });

    let error;
    try {
        ({ error } = await supabase.from('contacts').insert([result.value]));
    } catch (unexpectedError) {
        error = unexpectedError;
    }
    if (error) {
        console.error('Supabase contact insert failed', error);
        return res.status(500).json({
            error: { code: 'SUBMISSION_FAILED', message: 'Unable to submit your message right now.' },
        });
    }

    return res.status(202).json({ message: 'Your message has been received.' });
};

module.exports = { createContactHandler, validateContact };
