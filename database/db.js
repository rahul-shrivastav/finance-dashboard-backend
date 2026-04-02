const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("DB Connection Error:", error.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

module.exports = db;
