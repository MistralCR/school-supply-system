const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");
const { profesor } = require("../middlewares/roleMiddleware");

// @route   GET /api/categories
router.get("/", getCategories);

// @route   GET /api/categories/:id
router.get("/:id", getCategoryById);

// @route   POST /api/categories
router.post("/", protect, profesor, createCategory);

// @route   PUT /api/categories/:id
router.put("/:id", protect, profesor, updateCategory);

// @route   DELETE /api/categories/:id
router.delete("/:id", protect, profesor, deleteCategory);

module.exports = router;
