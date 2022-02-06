const util = require('util');
const { db } = require('../Database/Connection');
const query = util.promisify(db.query).bind(db);
const randomString = require('../Helper/RandomString');

module.exports = {
    generateVoucher: async (req, res) => {
        let data = req.data;

        const generateQuery = 'INSERT INTO';
    }
};
