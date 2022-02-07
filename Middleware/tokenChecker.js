const jwtVerify = require('../Helper/jwtVerify');
const jwtSign = require('../Helper/jwtSign');

const tokenChecker = (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
        return next();
    }

    const { payload, expired } = jwtVerify(accessToken);

    // For a valid access token
    if (payload) {
        req.user = payload;
        return next();
    }

    // expired but valid access token
    const { payload: refresh } =
        expired && refreshToken ? jwtVerify(refreshToken) : { payload: null };

    if (!refresh) {
        return next();
    }

    const newAccessToken = jwtSign(session, "5s");

    res.cookie("accessToken", newAccessToken, {
        maxAge: 8.64e7, // 1 Day
        httpOnly: true,
    });

    req.user = jwtVerify(newAccessToken).payload;

    return next();
};

module.exports = tokenChecker;