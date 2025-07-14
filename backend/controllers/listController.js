const Lista = require("../models/Lista");
const Material = require("../models/Material");

// @desc    Obtener todas las listas
// @route   GET /api/lists
// @access  Private
const getLists = async (req, res) => {
  try {
    let query = {};

    // Si es profesor, puede ver todas las listas oficiales que ha creado
    // Si es padre, solo puede ver las listas oficiales públicas (solo lectura)
    if (req.user.rol === "profesor") {
      query = {
        $or: [
          { usuario: req.user.id },
          { tipoLista: "oficial", usuario: req.user.id },
        ],
      };
    } else if (req.user.rol === "padre") {
      // Los padres solo pueden ver listas oficiales públicas
      query = {
        tipoLista: "oficial",
        esPublica: true,
      };
    } else {
      // Admin puede ver todas
      query = {};
    }

    const lists = await Lista.find(query)
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio imagen")
      .populate("usuario", "nombre email rol");

    res.json(lists);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Obtener lista por ID
// @route   GET /api/lists/:id
// @access  Private
const getListById = async (req, res) => {
  try {
    const list = await Lista.findById(req.params.id)
      .populate("usuario", "nombre email rol")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio imagen categoria");

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    // Verificar permisos según el rol
    if (req.user.rol === "admin") {
      // Admin puede ver todas las listas
      res.json(list);
    } else if (
      req.user.rol === "profesor" &&
      list.usuario._id.toString() === req.user.id
    ) {
      // Profesor puede ver sus propias listas
      res.json(list);
    } else if (
      req.user.rol === "padre" &&
      list.tipoLista === "oficial" &&
      list.esPublica
    ) {
      // Padre solo puede ver listas oficiales públicas
      res.json(list);
    } else {
      res
        .status(403)
        .json({ message: "No tienes permisos para ver esta lista" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Crear nueva lista
// @route   POST /api/lists
// @access  Private (Profesor/Admin)
const createList = async (req, res) => {
  const { nombre, nivel, materiales, esPublica } = req.body;

  try {
    // Solo profesores y admins pueden crear listas
    if (req.user.rol === "padre") {
      return res.status(403).json({
        message:
          "Los padres no pueden crear listas. Solo pueden visualizar las listas oficiales.",
      });
    }

    // Determinar tipo de lista según el rol del usuario
    let tipoLista = "personal";
    let publicaPermitida = false;

    if (req.user.rol === "profesor" || req.user.rol === "admin") {
      tipoLista = "oficial";
      publicaPermitida = true;
    }

    const list = new Lista({
      nombre,
      usuario: req.user.id,
      nivel,
      materiales: materiales || [],
      tipoLista,
      esPublica: publicaPermitida && esPublica ? true : false,
    });

    const createdList = await list.save();

    const populatedList = await Lista.findById(createdList._id)
      .populate("usuario", "nombre email rol")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio imagen");

    res.status(201).json(populatedList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Actualizar lista
// @route   PUT /api/lists/:id
// @access  Private (Profesor/Admin)
const updateList = async (req, res) => {
  const { nombre, nivel, materiales } = req.body;

  try {
    // Solo profesores y admins pueden actualizar listas
    if (req.user.rol === "padre") {
      return res.status(403).json({
        message:
          "Los padres no pueden modificar listas. Solo pueden visualizarlas.",
      });
    }

    const list = await Lista.findById(req.params.id);

    if (list && list.usuario.toString() === req.user.id) {
      list.nombre = nombre || list.nombre;
      list.nivel = nivel || list.nivel;
      list.materiales = materiales || list.materiales;

      const updatedList = await list.save();

      const populatedList = await Lista.findById(updatedList._id)
        .populate("usuario", "nombre email rol")
        .populate("nivel", "nombre grado")
        .populate("materiales.material", "nombre precio imagen");

      res.json(populatedList);
    } else {
      res.status(404).json({ message: "Lista no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Eliminar lista
// @route   DELETE /api/lists/:id
// @access  Private (Profesor/Admin)
const deleteList = async (req, res) => {
  try {
    // Solo profesores y admins pueden eliminar listas
    if (req.user.rol === "padre") {
      return res.status(403).json({
        message:
          "Los padres no pueden eliminar listas. Solo pueden visualizarlas.",
      });
    }

    const list = await Lista.findById(req.params.id);

    if (list && list.usuario.toString() === req.user.id) {
      await list.remove();
      res.json({ message: "Lista eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Lista no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Agregar material a lista
// @route   POST /api/lists/:id/materials
// @access  Private (Profesor/Admin)
const addMaterialToList = async (req, res) => {
  const { material, cantidad } = req.body;

  try {
    // Solo profesores y admins pueden modificar listas
    if (req.user.rol === "padre") {
      return res.status(403).json({
        message:
          "Los padres no pueden modificar listas. Solo pueden visualizarlas.",
      });
    }

    const list = await Lista.findById(req.params.id);

    if (list && list.usuario.toString() === req.user.id) {
      const existingMaterial = list.materiales.find(
        (item) => item.material.toString() === material
      );

      if (existingMaterial) {
        existingMaterial.cantidad += cantidad || 1;
      } else {
        list.materiales.push({
          material,
          cantidad: cantidad || 1,
        });
      }

      const updatedList = await list.save();

      const populatedList = await Lista.findById(updatedList._id).populate(
        "materiales.material",
        "nombre precio imagen"
      );

      res.json(populatedList);
    } else {
      res.status(404).json({ message: "Lista no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Remover material de lista
// @route   DELETE /api/lists/:id/materials/:materialId
// @access  Private (Profesor/Admin)
const removeMaterialFromList = async (req, res) => {
  try {
    // Solo profesores y admins pueden modificar listas
    if (req.user.rol === "padre") {
      return res.status(403).json({
        message:
          "Los padres no pueden modificar listas. Solo pueden visualizarlas.",
      });
    }

    const list = await Lista.findById(req.params.id);

    if (list && list.usuario.toString() === req.user.id) {
      list.materiales = list.materiales.filter(
        (item) => item.material.toString() !== req.params.materialId
      );

      const updatedList = await list.save();

      const populatedList = await Lista.findById(updatedList._id).populate(
        "materiales.material",
        "nombre precio imagen"
      );

      res.json(populatedList);
    } else {
      res.status(404).json({ message: "Lista no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Obtener listas oficiales por nivel
// @route   GET /api/lists/oficial/:nivelId
// @access  Public
const getListaOficialByNivel = async (req, res) => {
  try {
    const lists = await Lista.find({
      nivel: req.params.nivelId,
      tipoLista: "oficial",
      esPublica: true,
    })
      .populate("usuario", "nombre email rol")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio imagen categoria");

    res.json(lists);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Generar enlace para compartir lista
// @route   GET /api/lists/:id/share
// @access  Private
const generateShareLink = async (req, res) => {
  try {
    const list = await Lista.findById(req.params.id)
      .populate("usuario", "nombre email rol")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio imagen categoria");

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    // Verificar que sea una lista oficial y pública, o que el usuario tenga permisos
    if (list.tipoLista === "oficial" && list.esPublica) {
      // Generar URL para compartir
      const shareUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/lista/${list._id}`;

      res.json({
        shareUrl,
        lista: {
          nombre: list.nombre,
          nivel: list.nivel.nombre + " - " + list.nivel.grado,
          profesor: list.usuario.nombre,
          totalMateriales: list.materiales.length,
          totalEstimado: list.totalEstimado,
        },
      });
    } else {
      res
        .status(403)
        .json({ message: "Esta lista no se puede compartir públicamente" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Generar PDF de la lista para descargar
// @route   GET /api/lists/:id/export
// @access  Private
const exportListToPDF = async (req, res) => {
  try {
    const list = await Lista.findById(req.params.id)
      .populate("usuario", "nombre email rol")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio imagen categoria");

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    // Verificar permisos para exportar
    const canExport =
      req.user.rol === "admin" ||
      (req.user.rol === "profesor" &&
        list.usuario._id.toString() === req.user.id) ||
      (req.user.rol === "padre" &&
        list.tipoLista === "oficial" &&
        list.esPublica);

    if (!canExport) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para exportar esta lista" });
    }

    // Preparar datos para el PDF
    const listData = {
      nombre: list.nombre,
      nivel: list.nivel.nombre + " - " + list.nivel.grado,
      profesor: list.usuario.nombre,
      fechaCreacion: list.fechaCreacion,
      materiales: list.materiales.map((item) => ({
        nombre: item.material.nombre,
        cantidad: item.cantidad,
        precio: item.material.precio,
        subtotal: item.material.precio * item.cantidad,
      })),
      totalEstimado:
        list.totalEstimado ||
        list.materiales.reduce(
          (total, item) => total + item.material.precio * item.cantidad,
          0
        ),
    };

    res.json({
      message: "Datos de la lista preparados para exportar",
      data: listData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

module.exports = {
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
};
