const db = require("../database/db");

const findUserByEmail = (email, callback) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
};

const findUserById = (id, callback) => {
    db.get(
        `SELECT id, name, email, role, createdAt FROM users WHERE id = ?`,
        [id],
        callback,
    );
};

const getAllUsers = (callback) => {
    db.all(`SELECT id, name, email, role, createdAt FROM users`, [], callback);
};

const createUser = (user, callback) => {
    const { id, name, email, password, role } = user;

    db.run(
        `INSERT INTO users (id, name, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
        [id, name, email, password, role],
        callback,
    );
};

const findByEmailOrName = (email, name, callback) => {
    db.get(
        `SELECT * FROM users WHERE email = ? OR name = ?`,
        [email, name],
        callback,
    );
};

module.exports = {
    findUserByEmail,
    findUserById,
    getAllUsers,
    createUser,
    findByEmailOrName,
};
