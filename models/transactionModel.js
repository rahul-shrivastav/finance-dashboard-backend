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
    const { userId, categoryId, type, amount, note, createdBy } = txn;

    const query = `
    INSERT INTO transactions 
(userId, categoryId, type, amount, note, createdBy)
VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.run(
        query,
        [userId, categoryId, type, amount, note, createdBy],
        callback,
    );
};

const updateTransaction = (id, txn, callback) => {
    const { type, amount, categoryId, note } = txn;

    const query = `
        UPDATE transactions
        SET type = ?, amount = ?, categoryId = ?, note = ?
        WHERE id = ?
    `;

    db.run(query, [type, amount, categoryId, note, id], callback);
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
