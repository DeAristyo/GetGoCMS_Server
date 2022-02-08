const util = require('util');
const { db } = require('../Database/Connection');
const query = util.promisify(db.query).bind(db);
const bcrypt = require('bcrypt');
const jwtSign = require('../Helper/jwtSign');

module.exports = {
    login: async (req, res) => {
        const data = req.body;
        console.log(data);

        const loginQuery = `SELECT * FROM user WHERE phone = ?`;
        const getQuery = 'SELECT *, user_voucher.id as iduvoucher FROM user_voucher LEFT JOIN vouchers ON user_voucher.voucher_id = vouchers.id WHERE user_id = ?';

        try {
            let login = await query(loginQuery, [data.phone])
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            let userVoucher = await query(getQuery, login[0].id)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            if (!login) throw { error: true, message: 'User not found' };

            let passwordValidation = await bcrypt.compare(data.password, login[0].password)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            const accesstoken = jwtSign(
                { phone: login[0].phone, name: login[0].name }, '1d'
            );

            const refreshtoken = jwtSign(
                { phone: login[0].phone }, '1y'
            );

            await query('Commit');
            if (passwordValidation) {
                res.status(200).send({
                    error: false,
                    message: 'Login Successful',
                    data: {
                        phone: login[0].phone,
                        name: login[0].name,
                        accesstoken,
                        refreshtoken
                    },
                    voucher: userVoucher
                });
            } else {
                res.status(400).send({
                    error: false,
                    message: 'Password invalid',
                    detail: 'Password did not match!'
                });
            }

        } catch (error) {
            console.log(error);
            if (error.status) {
                res.status(error.status).send({
                    error: true,
                    message: error.message
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: error.message
                });
            }
        }
    },

    registerUser: async (req, res) => {
        const data = req.body;
        console.log(data.phone);

        let checkPhoneQuery = 'SELECT * FROM user WHERE phone = ?';
        let inputDataQuery = 'INSERT INTO user SET ?';

        try {
            await query('Start Transaction');

            const checkUser = await query(checkPhoneQuery, data.phone)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            if (checkUser.length >= 1) throw { status: 406, message: 'User already exist' };

            let hashedPassword = bcrypt.hashSync(data.password, 10);

            let dataToSet = {
                name: data.fullName,
                phone: data.phone,
                password: hashedPassword
            };

            const insertData = await query(inputDataQuery, dataToSet)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            await query('Commit');
            console.log('Register Success');
            res.status(200).send({
                error: false,
                message: 'Register Success'
            });
        } catch (error) {
            await query('Rollback');
            if (error.status) {
                res.status(error.status).send({
                    error: true,
                    message: error.message
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: error.message
                });
            }
        }
    },

    relog: async (req, res) => {
        const dataToken = req.dataToken;

        const loginQuery = `SELECT * FROM user WHERE phone = ?`;

        try {
            let login = await query(loginQuery, [dataToken.phone])
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            if (!login) throw { error: true, message: 'User not found' };

            const accessToken = jwtSign(
                { phone: login[0].phone, name: login[0].name }, '1d'
            );

            res.status(200).send({
                error: false,
                message: 're-Login Successful',
                data: {
                    phone: login[0].phone,
                    name: login[0].name,
                    accessToken,
                }
            });
        } catch (error) {
            console.log(error);
            if (error.status) {
                res.status(error.status).send({
                    error: true,
                    message: error.message
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: error.message
                });
            }
        }
    }
};