const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

const { getTransactions } = require("../controllers/transactionController");

router.get(
    "/",
    authenticate,
    authorize("admin", "viewer", "analyst"),
    getTransactions,
);

module.exports = router;
