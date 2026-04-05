const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const {
    getUsers,
    getUserById,
    createUserController,
    updateUserController,
    deleteUserController,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createUserController);
router.put("/:id", authenticate, authorize("admin"), updateUserController);
router.delete("/:id", authenticate, authorize("admin"), deleteUserController);

router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id", authenticate, authorize("admin"), getUserById);

module.exports = router;
