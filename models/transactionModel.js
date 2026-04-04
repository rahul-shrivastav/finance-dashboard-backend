const db = require("../database/db");

const getAllTransactions = (callback) => {
    const query = `
    SELECT t.*, u.name as userName
    FROM transactions t
    LEFT JOIN users u ON t.userId = u.id
  `;

    db.all(query, [], callback);
};

module.exports = {
    getAllTransactions,
};
