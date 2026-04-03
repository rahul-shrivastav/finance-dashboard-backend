const express = require("express");
const app = express();

const seedDatabase = require("./database/seed");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

require("dotenv").config();
app.use(express.json());
seedDatabase();

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
    res.send("Finance API Running");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
