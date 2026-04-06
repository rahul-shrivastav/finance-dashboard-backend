const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const seedDatabase = require("./database/seed");
const aggregateRoutes = require("./routes/aggregateRoutes");
const path = require("path");

require("dotenv").config();
seedDatabase();

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/aggregate", aggregateRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "home.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
