const express = require("express");
const router = express.Router();
const {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addMaterialToList,
  removeMaterialFromList,
  getListaOficialByNivel,
  generateShareLink,
  exportListToPDF,
} = require("../controllers/listController");
const { protect } = require("../middlewares/authMiddleware");
const { profesor } = require("../middlewares/roleMiddleware");

// @route   GET /api/lists
router.get("/", protect, getLists);

// @route   GET /api/lists/:id
router.get("/:id", protect, getListById);

// @route   POST /api/lists
router.post("/", protect, profesor, createList);

// @route   PUT /api/lists/:id
router.put("/:id", protect, profesor, updateList);

// @route   DELETE /api/lists/:id
router.delete("/:id", protect, profesor, deleteList);

// @route   POST /api/lists/:id/materials
router.post("/:id/materials", protect, profesor, addMaterialToList);

// @route   DELETE /api/lists/:id/materials/:materialId
router.delete(
  "/:id/materials/:materialId",
  protect,
  profesor,
  removeMaterialFromList
);

// @route   GET /api/lists/oficial/:nivelId
router.get("/oficial/:nivelId", getListaOficialByNivel);

// @route   GET /api/lists/:id/share
router.get("/:id/share", protect, generateShareLink);

// @route   GET /api/lists/:id/export
router.get("/:id/export", protect, exportListToPDF);

module.exports = router;
