const allowedEvents = new Set(['page_view', 'project_open', 'cv_open', 'contact_submit', 'outbound_click']);

const validateAnalyticsEvent = (body) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    const { event_name: eventName, path, subject_type: subjectType, subject_slug: subjectSlug, referrer_host: referrerHost } = body;
    const valid = allowedEvents.has(eventName)
        && typeof path === 'string' && path.startsWith('/') && path.length <= 500
        && (subjectType == null || (typeof subjectType === 'string' && subjectType.length <= 50))
        && (subjectSlug == null || (typeof subjectSlug === 'string' && subjectSlug.length <= 200))
        && (referrerHost == null || (typeof referrerHost === 'string' && referrerHost.length <= 253 && !referrerHost.includes('/')));
    if (!valid) return null;
    return {
        event_name: eventName, path, subject_type: subjectType || null,
        subject_slug: subjectSlug || null, referrer_host: referrerHost || null,
    };
};

module.exports = { validateAnalyticsEvent };
