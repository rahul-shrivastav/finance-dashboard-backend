const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
    getTransactions,
    createTxn,
    updateTxn,
    deleteTxn,
    getTxnById,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getTransactions);
router.get("/:id", authenticate, authorize("admin"), getTxnById);

router.post("/", authenticate, authorize("admin"), createTxn);
router.put("/:id", authenticate, authorize("admin"), updateTxn);
router.delete("/:id", authenticate, authorize("admin"), deleteTxn);

module.exports = router;
