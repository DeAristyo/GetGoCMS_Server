const express = require('express');
const routers = express.Router();
const CMScontroller = require('../Controller/CMScontroller');
const tokenChecker = require('../Middleware/tokenChecker');

routers.get('/paymentMethods', CMScontroller.paymentMethods);
routers.get('/voucherDetail', CMScontroller.getVoucherDetail);
routers.post('/userPaymentsDetails', CMScontroller.paymentVoucherDetail);
routers.post('/getAllUserVoucher', tokenChecker, CMScontroller.getAllUserVoucher);

module.exports = routers;