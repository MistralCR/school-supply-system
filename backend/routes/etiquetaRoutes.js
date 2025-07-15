const express = require("express");
const router = express.Router();
const {
  obtenerEtiquetas,
  crearEtiqueta,
  actualizarEtiqueta,
  eliminarEtiqueta,
  obtenerMaterialesPorEtiqueta,
  obtenerEstadisticasEtiquetas,
} = require("../controllers/etiquetaController");
const { protect } = require("../middlewares/authMiddleware");
const { admin, profesor } = require("../middlewares/roleMiddleware");

// @route   GET /api/etiquetas
// @access  Private
router.get("/", protect, obtenerEtiquetas);

// @route   POST /api/etiquetas
// @access  Private (Admin/Profesor)
router.post("/", protect, profesor, crearEtiqueta);

// @route   PUT /api/etiquetas/:id
// @access  Private (Admin/Profesor)
router.put("/:id", protect, profesor, actualizarEtiqueta);

// @route   DELETE /api/etiquetas/:id
// @access  Private (Admin)
router.delete("/:id", protect, admin, eliminarEtiqueta);

// @route   GET /api/etiquetas/estadisticas
// @access  Private
router.get("/estadisticas", protect, obtenerEstadisticasEtiquetas);

// @route   GET /api/etiquetas/:id/materiales
// @access  Private
router.get("/:id/materiales", protect, obtenerMaterialesPorEtiqueta);

module.exports = router;
