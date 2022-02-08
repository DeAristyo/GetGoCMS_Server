const express = require('express');
const routers = express.Router();
const authController = require('../Controller/authController');
const tokenChecker = require('../Middleware/tokenChecker');
const accountLimiter = require('../Middleware/createAccountLimiter');

routers.post('/register', accountLimiter, authController.registerUser);
routers.post('/login', authController.login);
routers.post('/relog', tokenChecker, authController.relog);

module.exports = routers;