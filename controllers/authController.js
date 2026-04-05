const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findRoleById } = require("../models/roleModel");

const {
    findUserByEmail,
    createUser,
    findByEmailOrName,
} = require("../models/userModel");

const signup = (req, res) => {
    const { id, name, email, password, roleId, status } = req.body;

    if (!id || !name || !email || !password || !roleId) {
        return res.status(400).json({ message: "All fields required" });
    }

    findByEmailOrName(email, name, async (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or username already exists",
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            createUser(
                { id, name, email, password: hashedPassword, roleId, status },
                function (err) {
                    if (err)
                        return res.status(500).json({ error: err.message });

                    findRoleById(roleId, (err, roleRow) => {
                        if (err)
                            return res.status(500).json({ error: err.message });

                        if (!roleRow) {
                            return res
                                .status(400)
                                .json({ message: "Invalid roleId" });
                        }

                        const token = jwt.sign(
                            {
                                userId: id,
                                role: roleRow.name,
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: "3d" },
                        );

                        res.status(201).json({ token });
                    });
                },
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
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
