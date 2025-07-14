const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/roleMiddleware");

// @route   GET /api/users
router.get("/", protect, admin, getUsers);

// @route   GET /api/users/:id
router.get("/:id", protect, getUserById);

// @route   PUT /api/users/profile
router.put("/profile", protect, updateUserProfile);

// @route   DELETE /api/users/:id
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
