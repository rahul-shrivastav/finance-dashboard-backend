const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
    findUserByEmail,
    createUser,
    findByEmailOrName,
} = require("../models/userModel");

const signup = (req, res) => {
    const { id, name, email, password, role, status } = req.body;

    if (!id || !name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    findByEmailOrName(email, name, async (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or username already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        createUser(
            { id, name, email, password: hashedPassword, role, status },
            (err) => {
                if (err) return res.status(500).json({ error: err.message });

                const token = jwt.sign(
                    { userId: id, role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" },
                );

                res.status(201).json({ token });
            },
        );
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (user.status !== "active") {
            return res.status(403).json({ message: "Account is inactive" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.json({ token });
    });
};

module.exports = { signup, login };
