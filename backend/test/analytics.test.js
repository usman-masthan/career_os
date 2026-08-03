const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAnalyticsEvent } = require('../controllers/analytics');

test('accepts only the privacy-safe analytics allowlist', () => {
    assert.deepEqual(validateAnalyticsEvent({
        event_name: 'project_open', path: '/projects/example', subject_type: 'project',
        subject_slug: 'example', referrer_host: 'example.com',
    }), {
        event_name: 'project_open', path: '/projects/example', subject_type: 'project',
        subject_slug: 'example', referrer_host: 'example.com',
    });
    assert.equal(validateAnalyticsEvent({ event_name: 'contact_message', path: '/contact' }), null);
    assert.equal(validateAnalyticsEvent({ event_name: 'page_view', path: 'https://outside.example' }), null);
    assert.equal(validateAnalyticsEvent({ event_name: 'page_view', path: '/', referrer_host: 'example.com/private/path' }), null);
});
