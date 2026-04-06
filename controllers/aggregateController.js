const {
    getTrendStats,
    getCategoryStats,
} = require("../models/transactionModel");

const getTrends = (req, res) => {
    const { userId } = req.params;

    const baseFilter = userId ? `AND userId = '${userId}'` : "";

    const weeklyFilter = `
        date(createdAt) >= date('now', '-7 days') ${baseFilter}
    `;

    const monthlyFilter = `
        strftime('%Y-%m', createdAt) = strftime('%Y-%m', 'now') ${baseFilter}
    `;

    const yearlyFilter = `
        strftime('%Y', createdAt) = strftime('%Y', 'now') ${baseFilter}
    `;

    getTrendStats(weeklyFilter, (err, weekly) => {
        if (err) return res.status(500).json({ error: err.message });

        getTrendStats(monthlyFilter, (err, monthly) => {
            if (err) return res.status(500).json({ error: err.message });

            getTrendStats(yearlyFilter, (err, yearly) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    weekly,
                    monthly,
                    yearly,
                });
            });
        });
    });
};

const getCategoryTrends = (req, res) => {
    const { userId } = req.query;

    const baseFilter = userId ? `AND userId = '${userId}'` : "";

    const weeklyFilter = `
        date(createdAt) >= date('now', '-7 days') ${baseFilter}
    `;

    const monthlyFilter = `
        strftime('%Y-%m', createdAt) = strftime('%Y-%m', 'now') ${baseFilter}
    `;

    const yearlyFilter = `
        strftime('%Y', createdAt) = strftime('%Y', 'now') ${baseFilter}
    `;

    getCategoryStats(weeklyFilter, (err, weekly) => {
        if (err) return res.status(500).json({ error: err.message });

        getCategoryStats(monthlyFilter, (err, monthly) => {
            if (err) return res.status(500).json({ error: err.message });

            getCategoryStats(yearlyFilter, (err, yearly) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    weekly,
                    monthly,
                    yearly,
                });
            });
        });
    });
};

module.exports = {
    getTrends,
    getCategoryTrends,
};
