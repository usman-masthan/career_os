const assert = require('node:assert/strict');
const test = require('node:test');
const { validateContact } = require('../controllers/contact');

test('normalizes a valid contact submission', () => {
    const result = validateContact({
        name: '  Ada Lovelace ',
        email: ' ADA@Example.COM ',
        message: '  I would like to work together. ',
    });

    assert.deepEqual(result, {
        value: {
            name: 'Ada Lovelace',
            email: 'ada@example.com',
            message: 'I would like to work together.',
        },
        isBot: false,
    });
});

test('rejects unknown fields and non-string values consistently', () => {
    const result = validateContact({ name: 42, email: 'a@example.com', message: 'A useful message', admin: true });

    assert.equal(result.error.error.code, 'VALIDATION_ERROR');
    assert.equal(result.error.error.fields.name, 'Must be a string.');
    assert.equal(result.error.error.fields.body, 'Contains unknown fields.');
});

test('identifies a filled honeypot without including it in stored values', () => {
    const result = validateContact({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'A sufficiently long note',
        website: 'spam.example',
    });

    assert.equal(result.isBot, true);
    assert.equal(Object.hasOwn(result.value, 'website'), false);
});
