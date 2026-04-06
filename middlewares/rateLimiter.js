const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2, //
    message: {
        message: "Too many login/signup attempts. Try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = authLimiter;
