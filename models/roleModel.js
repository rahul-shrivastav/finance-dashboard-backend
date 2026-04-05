const db = require("../database/db");

const findRoleById = (id, callback) => {
    db.get(`SELECT * FROM roles WHERE id = ?`, [id], callback);
};

module.exports = {
    findRoleById,
};
