const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const seedDatabase = require("./database/seed");

require("dotenv").config();
seedDatabase();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("backend server running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
