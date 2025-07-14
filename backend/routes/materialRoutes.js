const express = require("express");
const router = express.Router();
const {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialsByCategory,
  getMaterialsByLevel,
} = require("../controllers/materialController");
const { protect } = require("../middlewares/authMiddleware");
const { admin, profesor } = require("../middlewares/roleMiddleware");

// @route   GET /api/materials
router.get("/", getMaterials);

// @route   GET /api/materials/:id
router.get("/:id", getMaterialById);

// @route   POST /api/materials
router.post("/", protect, profesor, createMaterial);

// @route   PUT /api/materials/:id
router.put("/:id", protect, profesor, updateMaterial);

// @route   DELETE /api/materials/:id
router.delete("/:id", protect, profesor, deleteMaterial);

// @route   GET /api/materials/categoria/:id
router.get("/categoria/:id", getMaterialsByCategory);

// @route   GET /api/materials/nivel/:id
router.get("/nivel/:id", getMaterialsByLevel);

module.exports = router;
