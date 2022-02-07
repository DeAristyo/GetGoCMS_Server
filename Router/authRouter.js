const express = require('express');
const routers = express.Router();
const authController = require('../Controller/authController');

routers.post('/register', authController.registerUser);
routers.post('/login', authController.login);
routers.delete('/logout', authController.logout);

module.exports = routers;