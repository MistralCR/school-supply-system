const Material = require("../models/Material");
const Categoria = require("../models/Categoria");

// @desc    Obtener todos los materiales
// @route   GET /api/materials
// @access  Public
const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({})
      .populate("categoria", "nombre")
      .populate("nivel", "nombre grado");

    res.json(materials);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Obtener material por ID
// @route   GET /api/materials/:id
// @access  Public
const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("categoria", "nombre")
      .populate("nivel", "nombre grado");

    if (material) {
      res.json(material);
    } else {
      res.status(404).json({ message: "Material no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Crear nuevo material
// @route   POST /api/materials
// @access  Private (Profesor)
const createMaterial = async (req, res) => {
  const { nombre, descripcion, categoria, nivel, precio, imagen } = req.body;

  try {
    const material = new Material({
      nombre,
      descripcion,
      categoria,
      nivel,
      precio,
      imagen,
    });

    const createdMaterial = await material.save();

    const populatedMaterial = await Material.findById(createdMaterial._id)
      .populate("categoria", "nombre")
      .populate("nivel", "nombre grado");

    res.status(201).json(populatedMaterial);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Actualizar material
// @route   PUT /api/materials/:id
// @access  Private (Profesor)
const updateMaterial = async (req, res) => {
  const { nombre, descripcion, categoria, nivel, precio, imagen } = req.body;

  try {
    const material = await Material.findById(req.params.id);

    if (material) {
      material.nombre = nombre || material.nombre;
      material.descripcion = descripcion || material.descripcion;
      material.categoria = categoria || material.categoria;
      material.nivel = nivel || material.nivel;
      material.precio = precio || material.precio;
      material.imagen = imagen || material.imagen;

      const updatedMaterial = await material.save();

      const populatedMaterial = await Material.findById(updatedMaterial._id)
        .populate("categoria", "nombre")
        .populate("nivel", "nombre grado");

      res.json(populatedMaterial);
    } else {
      res.status(404).json({ message: "Material no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Eliminar material
// @route   DELETE /api/materials/:id
// @access  Private (Profesor)
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (material) {
      await material.remove();
      res.json({ message: "Material eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Material no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Obtener materiales por categoría
// @route   GET /api/materials/categoria/:id
// @access  Public
const getMaterialsByCategory = async (req, res) => {
  try {
    const materials = await Material.find({ categoria: req.params.id })
      .populate("categoria", "nombre")
      .populate("nivel", "nombre grado");

    res.json(materials);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Obtener materiales por nivel
// @route   GET /api/materials/nivel/:id
// @access  Public
const getMaterialsByLevel = async (req, res) => {
  try {
    const materials = await Material.find({ nivel: req.params.id })
      .populate("categoria", "nombre")
      .populate("nivel", "nombre grado");

    res.json(materials);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialsByCategory,
  getMaterialsByLevel,
};
