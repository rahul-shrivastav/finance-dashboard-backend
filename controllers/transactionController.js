const db = require("../database/db");

const getTransactions = (req, res) => {
    const query = `
    SELECT * FROM transactions t`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

module.exports = { getTransactions };
