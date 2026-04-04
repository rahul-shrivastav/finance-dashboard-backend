const db = require("../database/db");

const getUsers = (req, res) => {
    const query = `SELECT id,password, name, email, role, createdAt FROM users`;

    db.all(query, [], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(rows);
    });
};

module.exports = { getUsers };
