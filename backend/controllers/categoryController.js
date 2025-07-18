const Categoria = require("../models/Categoria");

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener categoría por ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Crear nueva categoría
// @route   POST /api/categories
// @access  Private (Profesor/Admin)
const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await Categoria.findOne({ nombre });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    }

    const categoria = new Categoria({
      nombre,
      descripcion,
    });

    const savedCategory = await categoria.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Actualizar categoría
// @route   PUT /api/categories/:id
// @access  Private (Profesor/Admin)
const updateCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Verificar si el nuevo nombre ya existe (excluyendo la categoría actual)
    if (nombre && nombre !== categoria.nombre) {
      const existingCategory = await Categoria.findOne({
        nombre,
        _id: { $ne: req.params.id },
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Ya existe una categoría con ese nombre" });
      }
    }

    categoria.nombre = nombre || categoria.nombre;
    categoria.descripcion = descripcion || categoria.descripcion;
    categoria.fechaActualizacion = Date.now();

    const updatedCategory = await categoria.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Eliminar categoría
// @route   DELETE /api/categories/:id
// @access  Private (Profesor/Admin)
const deleteCategory = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoria.deleteOne();
    res.json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
