const bcrypt = require("bcryptjs");
const {
    getAllUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    countUsers,
} = require("../models/userModel");

const createUserController = async (req, res) => {
    const { id, name, email, password, roleId, status } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        createUser(
            { id, name, email, password: hashedPassword, roleId, status },
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.status(201).json({ message: "User created" });
            },
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUserController = (req, res) => {
    updateUser(req.params.id, req.body, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "User updated" });
    });
};

const deleteUserController = (req, res) => {
    const { id } = req.params;

    deleteUser(req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "User deleted" });
    });
};

const getUsers = (req, res) => {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    countUsers((err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });

        getAllUsers(limit, offset, (err, users) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                page,
                limit,
                total: countResult.total,
                totalPages: Math.ceil(countResult.total / limit),
                data: users,
            });
        });
    });
};

const getUserById = (req, res) => {
    findUserById(req.params.id, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUserController,
    updateUserController,
    deleteUserController,
};
