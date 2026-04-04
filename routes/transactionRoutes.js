const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

const { getTransactions } = require("../controllers/transactionController");

router.get(
    "/",
    authenticate,
    authorize("admin", "user", "analyst"),
    getTransactions,
);

module.exports = router;
