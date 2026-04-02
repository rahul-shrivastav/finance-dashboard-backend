const express = require("express");
const app = express();

const transactionRoutes = require("./routes/transactionRoutes");
const db = require("./database/db");
const seedDatabase = require("./database/seed");

require("dotenv").config();
seedDatabase();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Finance API Running");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
