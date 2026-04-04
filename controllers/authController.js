const db = require("../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    const { id, name, email, password, role } = req.body;

    if (!id || !name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    const checkQuery = `SELECT * FROM users WHERE email = ? OR name = ?`;

    db.get(checkQuery, [email, name], async (err, existingUser) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (existingUser) {
            return res.status(400).json({
                message: "Email or username already exists",
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO users (id, name, email, password, role)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(
                insertQuery,
                [id, name, email, hashedPassword, role],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const token = jwt.sign(
                        { userId: id, role },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" },
                    );

                    res.status(201).json({
                        message: "User created",
                        token,
                    });
                },
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" },
            );

            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

module.exports = { signup, login };
