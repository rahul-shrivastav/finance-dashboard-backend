const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const {
    getTrends,
    getCategoryTrends,
} = require("../controllers/aggregateController");

router.get("/insights/user/:userId", authenticate, getTrends);
router.get("/insights", authenticate, authorize("admin"), getTrends);
router.get("/categories", authenticate, authorize("admin"), getCategoryTrends);

module.exports = router;
