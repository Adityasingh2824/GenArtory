// backend/src/config/middleware.js 

const express = require('express');
const morgan = require('morgan'); // For HTTP request logging
const helmet = require('helmet'); // For basic security headers
const rateLimit = require('express-rate-limit'); // For rate limiting

const middleware = (app) => {
    app.use(morgan('dev')); // Log requests to console in development mode
    app.use(helmet()); // Set security headers
    app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with increased limit

    // Apply rate limiting (optional)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.use('/api/', limiter); // Apply to all /api routes
};

module.exports = middleware;
