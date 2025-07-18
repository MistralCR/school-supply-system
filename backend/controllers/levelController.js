const Nivel = require("../models/Nivel");

// @desc    Obtener todos los niveles
// @route   GET /api/levels
// @access  Public
const getLevels = async (req, res) => {
  try {
    const niveles = await Nivel.find().sort({ orden: 1 });
    res.json(niveles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener nivel por ID
// @route   GET /api/levels/:id
// @access  Public
const getLevelById = async (req, res) => {
  try {
    const nivel = await Nivel.findById(req.params.id);

    if (!nivel) {
      return res.status(404).json({ message: "Nivel no encontrado" });
    }

    res.json(nivel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Crear nuevo nivel
// @route   POST /api/levels
// @access  Private (Profesor/Admin)
const createLevel = async (req, res) => {
  try {
    const { nombre, grado, orden, descripcion } = req.body;

    // Verificar si ya existe un nivel con ese nombre o grado
    const existingLevel = await Nivel.findOne({
      $or: [{ nombre }, { grado }],
    });
    if (existingLevel) {
      return res
        .status(400)
        .json({ message: "Ya existe un nivel con ese nombre o grado" });
    }

    const nivel = new Nivel({
      nombre,
      grado,
      orden,
      descripcion,
    });

    const savedLevel = await nivel.save();
    res.status(201).json(savedLevel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Actualizar nivel
// @route   PUT /api/levels/:id
// @access  Private (Profesor/Admin)
const updateLevel = async (req, res) => {
  try {
    const { nombre, grado, orden, descripcion } = req.body;

    const nivel = await Nivel.findById(req.params.id);

    if (!nivel) {
      return res.status(404).json({ message: "Nivel no encontrado" });
    }

    // Verificar si el nuevo nombre o grado ya existe (excluyendo el nivel actual)
    if (
      (nombre && nombre !== nivel.nombre) ||
      (grado && grado !== nivel.grado)
    ) {
      const existingLevel = await Nivel.findOne({
        $or: [{ nombre }, { grado }],
        _id: { $ne: req.params.id },
      });
      if (existingLevel) {
        return res
          .status(400)
          .json({ message: "Ya existe un nivel con ese nombre o grado" });
      }
    }

    nivel.nombre = nombre || nivel.nombre;
    nivel.grado = grado || nivel.grado;
    nivel.orden = orden !== undefined ? orden : nivel.orden;
    nivel.descripcion = descripcion || nivel.descripcion;
    nivel.fechaActualizacion = Date.now();

    const updatedLevel = await nivel.save();
    res.json(updatedLevel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Eliminar nivel
// @route   DELETE /api/levels/:id
// @access  Private (Profesor/Admin)
const deleteLevel = async (req, res) => {
  try {
    const nivel = await Nivel.findById(req.params.id);

    if (!nivel) {
      return res.status(404).json({ message: "Nivel no encontrado" });
    }

    await nivel.deleteOne();
    res.json({ message: "Nivel eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel,
};
