const util = require('util');
const { db } = require('../Database/Connection');
const query = util.promisify(db.query).bind(db);
const bcrypt = require('bcrypt');
const jwtSign = require('../Helper/jwtSign');

module.exports = {
    login: async (req, res) => {
        const data = req.body;

        const loginQuery = `SELECT * FROM user WHERE phone = ?`;

        try {
            let login = await query(loginQuery, [data.phone])
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            let passwordValidation = await bcrypt.compare(data.password, login[0].password)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            const accessToken = jwtSign(
                { phone: login[0].phone, name: login[0].name }, '1d'
            );

            const refreshToken = jwtSign(
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
                        accessToken,
                        refreshToken
                    }
                });
            } else {
                res.status(400).send({
                    error: false,
                    message: 'Password invalid',
                    detail: 'Password did not match!'
                });
            }

        } catch (error) {
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

    logout: (req, res) => {
        res.cookie("accessToken", "", {
            maxAge: 0,
            httpOnly: true,
        });

        res.cookie("refreshToken", "", {
            maxAge: 0,
            httpOnly: true,
        });
    }
};