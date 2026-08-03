const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = new Set([
    process.env.FRONTEND_URL,
    ...(process.env.DEVELOPMENT_ORIGINS || '').split(','),
].filter(Boolean).map((origin) => origin.trim().replace(/\/$/, '')));

app.use(cors({
    origin(origin, callback) {
        // Non-browser clients do not send Origin. Browser origins must be explicit.
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) return callback(null, true);
        return callback(new Error('Origin is not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || '16kb', strict: true }));

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError || error.type === 'entity.too.large') {
        const tooLarge = error.type === 'entity.too.large';
        return res.status(tooLarge ? 413 : 400).json({
            error: {
                code: tooLarge ? 'PAYLOAD_TOO_LARGE' : 'INVALID_JSON',
                message: tooLarge ? 'Request body is too large.' : 'Request body must be valid JSON.',
            },
        });
    }
    return next(error);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
