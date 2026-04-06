const {
    getAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    countTransactions,
} = require("../models/transactionModel");

const getTxnById = (req, res) => {
    const { id } = req.params;

    getTransactionById(id, (err, txn) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!txn) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(txn);
    });
};

const getTransactions = (req, res) => {
    const {
        page = 1,
        limit = 10,
        userId,
        type,
        categoryId,
        minAmount,
        maxAmount,
    } = req.query;

    const offset = (page - 1) * limit;

    const filters = {
        userId,
        type,
        categoryId,
        minAmount,
        maxAmount,
        limit: parseInt(limit),
        offset: parseInt(offset),
    };

    getAllTransactions(filters, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ page, limit, data });
    });
};

const createTxn = (req, res) => {
    const { userId, categoryId, type, amount, note } = req.body;

    const txn = {
        userId,
        categoryId,
        type,
        amount,
        note,
        createdBy: req.user.userId,
    };

    createTransaction(txn, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Transaction created",
            id: this.lastID,
        });
    });
};

const updateTxn = (req, res) => {
    const { id } = req.params;

    updateTransaction(id, req.body, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Transaction updated" });
    });
};

const deleteTxn = (req, res) => {
    const { id } = req.params;

    deleteTransaction(id, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Transaction deleted" });
    });
};

module.exports = {
    getTransactions,
    createTxn,
    updateTxn,
    deleteTxn,
    getTxnById,
};
