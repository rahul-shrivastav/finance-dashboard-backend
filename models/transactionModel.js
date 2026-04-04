const db = require("../database/db");
const getTransactionById = (id, callback) => {
    const query = `
    SELECT t.*, u.name as userName
    FROM transactions t
    LEFT JOIN users u ON t.userId = u.id
    WHERE t.id = ?
  `;

    db.get(query, [id], callback);
};
const getAllTransactions = (callback) => {
    const query = `
    SELECT t.*, u.name as userName
    FROM transactions t
    LEFT JOIN users u ON t.userId = u.id
  `;

    db.all(query, [], callback);
};

const createTransaction = (txn, callback) => {
    const { userId, type, amount, category, mode, date, note, createdBy } = txn;

    const query = `
    INSERT INTO transactions
    (userId, type, amount, category, mode, date, note, createdBy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.run(
        query,
        [userId, type, amount, category, mode, date, note, createdBy],
        callback,
    );
};

const updateTransaction = (id, txn, callback) => {
    const { type, amount, category, mode, date, note } = txn;

    const query = `
        UPDATE transactions
        SET type = ?, amount = ?, category = ?, mode = ?, date = ?, note = ?
        WHERE id = ?
    `;

    db.run(query, [type, amount, category, mode, date, note, id], callback);
};

const deleteTransaction = (id, callback) => {
    db.run(`DELETE FROM transactions WHERE id = ?`, [id], callback);
};

module.exports = {
    getAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
};
