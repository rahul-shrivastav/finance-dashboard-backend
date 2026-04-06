const db = require("../database/db");
const { get } = require("../routes/userRoutes");

const getTransactionById = (id, callback) => {
    const query = `
    SELECT t.*, u.name as userName
    FROM transactions t
    LEFT JOIN users u ON t.userId = u.id
    WHERE t.id = ?
  `;

    db.get(query, [id], callback);
};

const countTransactions = (callback) => {
    db.get(`SELECT COUNT(*) as total FROM transactions`, [], callback);
};

const getAllTransactions = (filters, callback) => {
    let query = `
        SELECT 
            t.id,
            t.type,
            t.amount,
            t.note,
            t.createdAt,
            t.createdBy,
            u.name as name,
            t.userId,
            c.name as category
        FROM transactions t
        LEFT JOIN users u ON t.userId = u.id
        LEFT JOIN categories c ON t.categoryId = c.id
        WHERE 1=1
    `;

    const params = [];

    if (filters.userId) {
        query += ` AND t.userId = ?`;
        params.push(filters.userId);
    }

    if (filters.type) {
        query += ` AND t.type = ?`;
        params.push(filters.type);
    }

    if (filters.categoryId) {
        query += ` AND t.categoryId = ?`;
        params.push(filters.categoryId);
    }

    if (filters.minAmount) {
        query += ` AND t.amount >= ?`;
        params.push(filters.minAmount);
    }

    if (filters.maxAmount) {
        query += ` AND t.amount <= ?`;
        params.push(filters.maxAmount);
    }

    query += ` ORDER BY t.createdAt DESC LIMIT ? OFFSET ?`;
    params.push(filters.limit, filters.offset);

    db.all(query, params, callback);
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

const getTrendStats = (timeFilter, callback) => {
    const query = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
            COUNT(*) as numberOfTransactions,
            AVG(amount) as averageTransactionAmount
        FROM transactions
        WHERE ${timeFilter}
    `;

    db.get(query, [], (err, basicStats) => {
        if (err) return callback(err);

        // Most used category
        const categoryQuery = `
            SELECT c.name, COUNT(*) as count
            FROM transactions t
            JOIN categories c ON t.categoryId = c.id
            WHERE ${timeFilter}
            GROUP BY t.categoryId
            ORDER BY count DESC
            LIMIT 1
        `;

        db.get(categoryQuery, [], (err, category) => {
            if (err) return callback(err);

            // Most frequent type
            const typeQuery = `
                SELECT type, COUNT(*) as count
                FROM transactions
                WHERE ${timeFilter}
                GROUP BY type
                ORDER BY count DESC
                LIMIT 1
            `;

            db.get(typeQuery, [], (err, typeResult) => {
                if (err) return callback(err);

                callback(null, {
                    totalIncome: basicStats.totalIncome || 0,
                    totalExpense: basicStats.totalExpense || 0,
                    mostUsedCategory: category?.name || null,
                    mostFrequentTransactionType: typeResult?.type || null,
                    averageTransactionAmount: Math.round(
                        basicStats.averageTransactionAmount || 0,
                    ),
                    numberOfTransactions: basicStats.numberOfTransactions || 0,
                });
            });
        });
    });
};

const getCategoryStats = (timeFilter, callback) => {
    const query = `
        SELECT 
            c.name as category,
            COUNT(*) as count
        FROM transactions t
        JOIN categories c ON t.categoryId = c.id
        WHERE ${timeFilter}
        GROUP BY t.categoryId
        ORDER BY count DESC
    `;

    db.all(query, [], callback);
};
module.exports = {
    getAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    countTransactions,
    getTrendStats,
    getCategoryStats,
};
