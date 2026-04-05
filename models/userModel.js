const db = require("../database/db");

const findUserByEmail = (email, callback) => {
    db.get(
        `
    SELECT u.*, r.name as role
    FROM users u
    JOIN roles r ON u.roleId = r.id
    WHERE email = ?
  `,
        [email],
        callback,
    );
};

const findUserById = (id, callback) => {
    db.get(
        `
    SELECT u.*, r.name as role
    FROM users u
    JOIN roles r ON u.roleId = r.id
    WHERE u.id = ?
  `,
        [id],
        callback,
    );
};

const getAllUsers = (callback) => {
    db.all(`SELECT * FROM users`, [], callback);
};

const createUser = (user, callback) => {
    const { id, name, email, password, role, status } = user;

    db.run(
        `INSERT INTO users (id, name, email, password, role, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, email, password, role, status],
        callback,
    );
};
const updateUser = (id, user, callback) => {
    const { name, email, role, status } = user;

    db.run(
        `UPDATE users
     SET name = ?, email = ?, role = ?, status = ?
     WHERE id = ?`,
        [name, email, role, status, id],
        callback,
    );
};
const deleteUser = (id, callback) => {
    db.run(`DELETE FROM users WHERE id = ?`, [id], callback);
};
const findByEmailOrName = (email, name, callback) => {
    db.get(
        `SELECT id, name, email, role, status, createdAt FROM users WHERE email = ? OR name = ?`,
        [email, name],
        callback,
    );
};

module.exports = {
    findUserByEmail,
    findUserById,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    findByEmailOrName,
};
