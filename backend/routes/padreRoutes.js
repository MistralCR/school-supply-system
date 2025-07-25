const express = require("express");
const router = express.Router();
const {
  marcarMaterialComprado,
  enviarListaPorEmail,
  obtenerResumenCompras,
} = require("../controllers/padreController");
const { protect } = require("../middlewares/authMiddleware");

// @route   POST /api/padre/lists/:id/materials/:materialId/comprado
router.post(
  "/lists/:id/materials/:materialId/comprado",
  protect,
  marcarMaterialComprado
);

// @route   POST /api/padre/lists/:id/email
router.post("/lists/:id/email", protect, enviarListaPorEmail);

// @route   GET /api/padre/resumen
router.get("/resumen", protect, obtenerResumenCompras);

// @route   GET /api/padre/etiquetas
// @desc    Obtener etiquetas disponibles para filtrado
router.get(
  "/etiquetas",
  protect,
  require("../controllers/etiquetaController").obtenerEtiquetas
);

module.exports = router;
