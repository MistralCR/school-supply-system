const express = require("express");
const router = express.Router();
const {
  getLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel,
} = require("../controllers/levelController");
const { protect } = require("../middlewares/authMiddleware");
const { profesor } = require("../middlewares/roleMiddleware");

// @route   GET /api/levels
router.get("/", getLevels);

// @route   GET /api/levels/:id
router.get("/:id", getLevelById);

// @route   POST /api/levels
router.post("/", protect, profesor, createLevel);

// @route   PUT /api/levels/:id
router.put("/:id", protect, profesor, updateLevel);

// @route   DELETE /api/levels/:id
router.delete("/:id", protect, profesor, deleteLevel);

module.exports = router;
