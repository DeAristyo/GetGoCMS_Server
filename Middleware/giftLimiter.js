const rateLimit = require('express-rate-limit');

const giftVoucherLimit = rateLimit({
    windowMs: 1.1574e-8,
    max: 3,
    message: 'You cannot gift more than 3 voucher per day'
});

module.exports = giftVoucherLimit;