const util = require('util');
const { db } = require('../Database/Connection');
const query = util.promisify(db.query).bind(db);
const randomString = require('../Helper/RandomString');

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

    paymentVoucherDetail: async (req, res) => {
        const data = req.body;

        let detailVoucher = 'SELECT * FROM vouchers WHERE id = ?';

        try {
            const getDetail = await query(detailVoucher, data.voucherID)
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            let paymentDetails = getDetail.map((val) => ({
                amount: val.amount,
                price: val.price,
                description: val.description,
                qty: data.voucherQTY
            }));

            res.status(200).send({
                error: false,
                message: 'Get Voucher for payment success',
                data: paymentDetails[0]
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
        const token = req.dataToken;
        const data = req.body;

        // let getQuery = 'SELECT * FROM user_vouchers WHERE id = ?';

        try {
            //     const getData = await query(getQuery)
            //         .catch((err) => {
            //             console.log(err);
            //             throw err;
            //         });

            res.status(200).send({
                error: false,
                message: 'Get Voucher Data Success',
                data: token
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
