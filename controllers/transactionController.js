const { getAllTransactions } = require("../models/transactionModel");

const getTransactions = (req, res) => {
    getAllTransactions((err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
};

module.exports = { getTransactions };
