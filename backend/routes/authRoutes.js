const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// @route   POST /api/auth/register
router.post("/register", registerUser);

// @route   POST /api/auth/login
router.post("/login", authUser);

// @route   GET /api/auth/profile
router.get("/profile", protect, getUserProfile);

// @route   POST /api/auth/logout
router.post("/logout", protect, logoutUser);

module.exports = router;
