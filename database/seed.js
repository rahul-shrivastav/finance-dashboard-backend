const db = require("./db");

const seedDatabase = () => {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS transactions`);
        db.run(`DROP TABLE IF EXISTS users`);

        db.run(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT CHECK(role IN ('viewer','analyst','admin')) NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`
        CREATE TABLE transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            type TEXT CHECK(type IN ('income','expense')),
            amount REAL,
            category TEXT,
            mode TEXT,
            date TEXT,
            note TEXT,
            createdBy TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        )`);

        const users = [
            ["admin_1", "Admin User", "admin@test.com", "123456", "admin"],
            ["user_1", "Rahul", "rahul@test.com", "123456", "viewer"],
            ["user_2", "Amit", "amit@test.com", "123456", "analyst"],
        ];

        const userQuery = `
        INSERT INTO users (id, name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
        `;

        users.forEach((user) => {
            db.run(userQuery, user);
        });

        // Insert transactions
        const transactions = [
            [
                "user_1",
                "expense",
                500,
                "Food",
                "UPI",
                "2026-04-01",
                "Lunch",
                "admin_1",
            ],
            [
                "user_1",
                "income",
                20000,
                "Salary",
                "Bank",
                "2026-04-01",
                "Salary",
                "admin_1",
            ],
            [
                "user_2",
                "expense",
                1500,
                "Shopping",
                "Card",
                "2026-04-02",
                "Clothes",
                "admin_1",
            ],
        ];
        const txnQuery = `
            INSERT INTO transactions 
            (userId, type, amount, category, mode, date, note, createdBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        transactions.forEach((txn) => {
            db.run(txnQuery, txn);
        });

        console.log("Database seeded successfully");
    });
};

module.exports = seedDatabase;
