const express = require('express');
const routers = express.Router();
const CMScontroller = require('../Controller/CMScontroller');

routers.get('/paymentMethods', CMScontroller.paymentMethods);
routers.get('/voucherDetail', CMScontroller.getVoucherDetail);
routers.post('/userPaymentsDetails', CMScontroller.paymentVoucherDetail);

module.exports = routers;