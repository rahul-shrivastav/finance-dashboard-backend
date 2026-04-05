const bcrypt = require("bcryptjs");
const {
    getAllUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
} = require("../models/userModel");

const createUserController = async (req, res) => {
    const { id, name, email, password, role, status } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        createUser(
            { id, name, email, password: hashedPassword, role, status },
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
    getAllUsers((err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(users);
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
