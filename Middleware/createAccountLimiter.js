const rateLimit = require('express-rate-limit');

const createAccountLimit = rateLimit({
    windowMs: 1.1574e-8,
    max: 10,
    message: 'You cannot create more than 10 account per day'
});

module.exports = createAccountLimit;