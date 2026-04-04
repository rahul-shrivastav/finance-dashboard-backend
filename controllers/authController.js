const db = require("../database/db");
const jwt = require("jsonwebtoken");

const signup = (req, res) => {
    const { id, name, email, password, role } = req.body;

    if (!id || !name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    const query = `
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(query, [id, name, email, password, role], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const token = jwt.sign({ userId: id, role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({
            message: "User created",
            token,
        });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.json({ token });
    });
};

module.exports = {
    signup,
    login,
};
