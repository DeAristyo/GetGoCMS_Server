const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1.1574e-8,
    max: 5,
    message: 'You cannot buy more than 5 voucher per 24 hours'
});

module.exports = limiter;