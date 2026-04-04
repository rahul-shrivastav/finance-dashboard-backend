const { getAllUsers, findUserById } = require("../models/userModel");

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
};
