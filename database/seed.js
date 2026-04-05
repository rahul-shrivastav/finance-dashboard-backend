const db = require("./db");

const seedDatabase = () => {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS transactions`);
        db.run(`DROP TABLE IF EXISTS users`);

        // the roles table
        db.run(`
            CREATE TABLE roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
            `);
        // the categories table
        db.run(`
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
            `);
        db.run(`
            CREATE TABLE users (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE,
                email TEXT UNIQUE,
                password TEXT,
                roleId INTEGER,
                status TEXT CHECK(status IN ('active','inactive')) DEFAULT 'active',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (roleId) REFERENCES roles(id)
            )
        `);

        db.run(`
            CREATE TABLE transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT,
                categoryId INTEGER,
                type TEXT CHECK(type IN ('income','expense')),
                amount REAL,
                note TEXT,
                createdBy TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (categoryId) REFERENCES categories(id),
                FOREIGN KEY (createdBy) REFERENCES users(id)
            )
            `);

        const roles = ["admin", "analyst", "viewer"];
        roles.forEach((role) => {
            db.run(`INSERT INTO roles (name) VALUES (?)`, [role]);
        });
        const categories = [
            ["Food", "expense"],
            ["Shopping", "expense"],
            ["Salary", "income"],
        ];

        categories.forEach((cat) => {
            db.run(`INSERT INTO categories (name, type) VALUES (?, ?)`, cat);
        });

        const users = [
            ["admin_1", "Admin", "admin@test.com", "123456", 1, "active"], // admin
            ["user_1", "Rahul", "rahul@test.com", "123456", 3, "active"], // viewer
            ["user_2", "Amit", "amit@test.com", "123456", 2, "inactive"], // analyst
        ];

        db.run(`
            INSERT INTO users (id, name, email, password, roleId, status)
            VALUES (?, ?, ?, ?, ?, ?)
            `);

        users.forEach((user) => {
            db.run(userQuery, user);
        });

        const transactions = [
            [
                "user_1",
                1,
                "expense",
                500,
                "UPI",
                "2026-04-01",
                "Lunch",
                "admin_1",
            ],
            [
                "user_1",
                3,
                "income",
                20000,
                "Bank",
                "2026-04-01",
                "Salary",
                "admin_1",
            ],
        ];
        const txnQuery = `
            INSERT INTO transactions 
            (userId, categoryId, type, amount, mode, date, note, createdBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        transactions.forEach((txn) => {
            db.run(txnQuery, txn);
        });

        console.log("Database seeded successfully");
    });
};

module.exports = seedDatabase;
