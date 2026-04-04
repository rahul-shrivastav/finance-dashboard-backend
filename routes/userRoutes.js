const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const router = express.Router();
router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id", authenticate, authorize("admin"), getUserById);

module.exports = router;
