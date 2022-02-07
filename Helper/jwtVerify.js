const JWT = require('jsonwebtoken');
require('dotenv').config();

const jwtVerify = (token) => {
    try {
        const decoded = JWT.verify(token, process.env.TOKEN_SECRET);
        return { payload: decoded, expired: false };
    } catch (error) {
        return { payload: null, expired: error.message.includes('jwt expired') };
    }
};

module.exports = jwtVerify;