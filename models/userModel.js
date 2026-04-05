const db = require("../database/db");

const findUserByEmail = (email, callback) => {
    db.get(
        `
        SELECT u.*, r.name as role
        FROM users u
        JOIN roles r ON u.roleId = r.id
        WHERE u.email = ?
        `,
        [email],
        callback,
    );
};

const findUserById = (id, callback) => {
    db.get(
        `
        SELECT u.id, u.name, u.email, u.status, u.createdAt, r.name as role
        FROM users u
        JOIN roles r ON u.roleId = r.id
        WHERE u.id = ?
        `,
        [id],
        callback,
    );
};

const countUsers = (callback) => {
    db.get(`SELECT COUNT(*) as total FROM users`, [], callback);
};

const getAllUsers = (limit, offset, callback) => {
    db.all(
        `
        SELECT u.id, u.name, u.email, u.status, u.createdAt, r.name as role
        FROM users u
        JOIN roles r ON u.roleId = r.id
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
        callback,
    );
};

const createUser = (user, callback) => {
    const { id, name, email, password, roleId, status } = user;

    db.run(
        `
        INSERT INTO users (id, name, email, password, roleId, status)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [id, name, email, password, roleId, status],
        callback,
    );
};

const updateUser = (id, user, callback) => {
    const { name, email, roleId, status } = user;

    db.run(
        `
        UPDATE users
        SET name = ?, email = ?, roleId = ?, status = ?
        WHERE id = ?
        `,
        [name, email, roleId, status, id],
        callback,
    );
};

const deleteUser = (id, callback) => {
    db.run(`DELETE FROM users WHERE id = ?`, [id], callback);
};

const findByEmailOrName = (email, name, callback) => {
    db.get(
        `
        SELECT u.*, r.name as role
        FROM users u
        JOIN roles r ON u.roleId = r.id
        WHERE u.email = ? OR u.name = ?
        `,
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
    countUsers,
};
