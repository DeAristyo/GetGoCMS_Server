const util = require('util');
const { db } = require('../Database/Connection');
const query = util.promisify(db.query).bind(db);
const randomString = require('../Helper/RandomString');
const genQr = require('../Helper/qrCodeGenerator');

module.exports = {
    getVoucherDetail: async (req, res) => {
        let getQuery = 'SELECT * FROM vouchers';

        try {
            const getData = await query(getQuery)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            res.status(200).send({
                error: false,
                message: 'Get Voucher Data success',
                data: getData
            });
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

    paymentMethods: async (req, res) => {
        let methodQuery = 'SELECT * FROM payment_method';

        try {
            const getPaymentMethod = await query(methodQuery)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            res.status(200).send({
                error: false,
                message: 'Get Payment methods success',
                data: getPaymentMethod
            });
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

    getAllUserVoucher: async (req, res) => {
        // const token = req.dataToken;
        const data = req.body;

        let getUserQuery = 'SELECT * FROM user WHERE phone = ?';
        // let getQuery = 'SELECT * FROM user_vouchers WHERE user_id = ?';
        let getQuery = 'SELECT *, user_voucher.id as iduvoucher FROM user_voucher LEFT JOIN vouchers ON user_voucher.voucher_id = vouchers.id WHERE user_id = ?';

        try {
            const user = await query(getUserQuery, data.phone)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            const getData = await query(getQuery, user[0].id)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            res.status(200).send({
                error: false,
                message: 'Get Voucher Data Success',
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
    },

    makePayment: async (req, res) => {
        const data = req.body;

        let getUserQuery = 'SELECT * FROM user WHERE phone = ?';
        let getPaymentMethodQuery = 'SELECT * FROM payment_method WHERE payment_provider = ?';
        let getVoucherQuery = 'SELECT * FROM vouchers WHERE id = ?';
        let insertQuery = "INSERT INTO user_voucher SET ?";
        let timeQuery = 'UPDATE user_voucher SET expiry_date = CURRENT_TIMESTAMP() + interval 12 month WHERE id = ?';

        try {
            await query('Start Transaction');
            const user = await query(getUserQuery, data.userPhone)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
            console.log(user);

            const paymentMethod = await query(getPaymentMethodQuery, data.payment_methods)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            const voucher = await query(getVoucherQuery, data.voucherID)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });


            const total = (voucher[0].price * data.qty) - (voucher[0].price * paymentMethod[0].discount);

            let result;

            for (let i = 0; i < data.qty; i++) {
                const code = randomString();

                let dataToset = {
                    user_id: user[0].id,
                    voucher_code: code,
                    message: data.message ? data.message : 'Self Bought',
                    voucher_id: voucher[0].id,
                    status: 'Unused',
                    payment_amount: total,
                    payment_status: 'Paid'
                };
                result = await query(insertQuery, dataToset)
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });

                const time = await query(timeQuery, result.insertId)
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            }

            await query('Commit');
            res.status(200).send({
                error: false,
                message: 'Transaction success, put the amount at the pay request to complete the transaction',
                detail: {
                    userdetail: {
                        name: user[0].name,
                        phone: user[0].phone
                    },
                    amount_to_pay: total,
                    voucher_amount: voucher[0].amount,
                    quantity: data.qty
                }

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

    makeGift: async (req, res) => {
        const data = req.body;

        let getUserQuery = 'SELECT * FROM user WHERE phone = ?';
        let getPaymentMethodQuery = 'SELECT * FROM payment_method WHERE payment_provider = ?';
        let getVoucherQuery = 'SELECT * FROM vouchers WHERE id = ?';
        let insertQuery = "INSERT INTO user_voucher SET ?";
        let timeQuery = 'UPDATE user_voucher SET expiry_date = CURRENT_TIMESTAMP() + interval 12 month WHERE id = ?';

        try {
            await query('Start Transaction');
            const user = await query(getUserQuery, data.userPhone)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
            console.log(user);

            const paymentMethod = await query(getPaymentMethodQuery, data.payment_methods)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            const voucher = await query(getVoucherQuery, data.voucherID)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });


            const total = (voucher[0].price * data.qty) - (voucher[0].price * paymentMethod[0].discount);

            let result;

            for (let i = 0; i < data.qty; i++) {
                const code = randomString();

                let dataToset = {
                    user_id: user[0].id,
                    voucher_code: code,
                    message: data.message ? data.message : 'Self Bought',
                    voucher_id: voucher[0].id,
                    status: 'Unused',
                    payment_amount: total,
                    payment_status: 'Paid'
                };
                result = await query(insertQuery, dataToset)
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });

                const time = await query(timeQuery, result.insertId)
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            }

            await query('Commit');
            res.status(200).send({
                error: false,
                message: 'Transaction success, put the amount at the pay request to complete the transaction',
                detail: {
                    userdetail: {
                        name: user[0].name,
                        phone: user[0].phone
                    },
                    amount_to_pay: total,
                    voucher_amount: voucher[0].amount,
                    quantity: data.qty
                }

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

    deleteUserVoucher: async (req, res) => {
        const data = req.params;

        let deleteQuery = 'DELETE FROM user_voucher WHERE (id = ?)';
        try {
            await query('Start Transaction');

            const deleteAddress = await query(deleteQuery, data.ID)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            await query('Commit');
            console.log('Delete voucher success');
            res.status(200).send({
                error: false,
                message: 'Voucher Deleted',
                detail: 'Delete Voucher Success'
            });
        } catch (err) {
            await query('Rollback');
            if (err.status) {
                res.status(err.status).send({
                    error: true,
                    message: err.message,
                    detail: err.detail
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: err.message
                });
            }
        }
    },

    editVoucher: async (req, res) => {
        const data = req.body;

        let getUserQuery = 'SELECT * FROM user WHERE phone = ?';
        let updateQuery = 'UPDATE user_voucher SET user_id = ? WHERE (voucher_code = ?)';

        try {
            await query('Start Transaction');

            const user = await query(getUserQuery, data.giftPhone)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            if (user.length < 1) throw { error: true, message: 'User not found!' };

            const update = await query(updateQuery, [user[0].id, data.code])
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            await query('Commit');
            res.status(200).send({
                error: false,
                message: 'Voucher is sent as a gift'
            });
        } catch (err) {
            await query('Rollback');
            if (err.status) {
                res.status(err.status).send({
                    error: true,
                    message: err.message,
                    detail: err.detail
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: err.message
                });
            }
        }
    }
};
