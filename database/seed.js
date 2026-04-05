const db = require("./db");

const seedDatabase = () => {
    db.serialize(() => {
        // Drop tables (correct order)
        db.run(`DROP TABLE IF EXISTS transactions`);
        db.run(`DROP TABLE IF EXISTS users`);
        db.run(`DROP TABLE IF EXISTS categories`);
        db.run(`DROP TABLE IF EXISTS roles`);

        // Roles table
        db.run(`
            CREATE TABLE roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
        `);

        // Categories table (payment modes)
        db.run(`
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
        `);

        // Users table
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

        // Transactions table
        db.run(`
            CREATE TABLE transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                categoryId INTEGER NOT NULL,
                type TEXT CHECK(type IN ('income','expense')),
                amount REAL,
                note TEXT,
                createdBy TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (categoryId) REFERENCES categories(id),
                FOREIGN KEY (createdBy) REFERENCES users(id)
            )
        `);

        // Seed roles
        const roles = ["admin", "analyst", "viewer"];
        roles.forEach((role) => {
            db.run(`INSERT INTO roles (name) VALUES (?)`, [role]);
        });

        // Seed categories (payment modes)
        const categories = ["UPI", "Cash", "Netbanking"];
        categories.forEach((name) => {
            db.run(`INSERT INTO categories (name) VALUES (?)`, [name]);
        });

        // Seed users (plain passwords)
        const users = [
            ["admin_1", "Admin", "admin@test.com", "123456", 1, "active"],
            ["user_1", "Rahul", "rahul@test.com", "123456", 3, "active"],
            ["user_2", "Amit", "amit@test.com", "123456", 2, "inactive"],
        ];

        const userQuery = `
            INSERT INTO users (id, name, email, password, roleId, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        users.forEach((user) => {
            db.run(userQuery, user);
        });

        // Seed transactions (FIXED)
        const transactions = [
            ["user_1", 1, "expense", 500, "Lunch", "admin_1"],
            ["user_1", 3, "income", 20000, "Salary", "admin_1"],
        ];

        const txnQuery = `
            INSERT INTO transactions 
            (userId, categoryId, type, amount, note, createdBy)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        transactions.forEach((txn) => {
            db.run(txnQuery, txn);
        });

        console.log("Database seeded successfully");
    });
};

module.exports = seedDatabase;
