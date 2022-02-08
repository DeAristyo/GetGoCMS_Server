const express = require('express');
const routers = express.Router();
const CMScontroller = require('../Controller/CMScontroller');
const tokenChecker = require('../Middleware/tokenChecker');
const rateLimit = require('../Middleware/rateLimiter');
const giftLimit = require('../Middleware/giftLimiter');

routers.get('/paymentMethods', CMScontroller.paymentMethods);
routers.get('/voucherDetail', CMScontroller.getVoucherDetail);
routers.post('/getAllUserVoucher', CMScontroller.getAllUserVoucher);
routers.post('/makePayments', rateLimit, CMScontroller.makePayment);
routers.post('/sendGift', rateLimit, CMScontroller.makeGift);
routers.delete('/deleteVoucher/:ID', CMScontroller.deleteUserVoucher);
routers.patch('/editVoucher', CMScontroller.editVoucher);

module.exports = routers;