const Etiqueta = require("../models/Etiqueta");
const Material = require("../models/Material");

// @desc    Obtener todas las etiquetas
// @route   GET /api/etiquetas
// @access  Private
const obtenerEtiquetas = async (req, res) => {
  try {
    const etiquetas = await Etiqueta.find({ activa: true }).sort({ nombre: 1 });
    res.json(etiquetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Crear nueva etiqueta
// @route   POST /api/etiquetas
// @access  Private (Admin/Profesor)
const crearEtiqueta = async (req, res) => {
  const { nombre, descripcion, color, icono } = req.body;

  try {
    // Verificar si ya existe
    const etiquetaExiste = await Etiqueta.findOne({
      nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
    });

    if (etiquetaExiste) {
      return res
        .status(400)
        .json({ message: "Ya existe una etiqueta con ese nombre" });
    }

    const etiqueta = await Etiqueta.create({
      nombre: nombre.trim(),
      descripcion,
      color,
      icono,
    });

    res.status(201).json(etiqueta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Actualizar etiqueta
// @route   PUT /api/etiquetas/:id
// @access  Private (Admin/Profesor)
const actualizarEtiqueta = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, color, icono, activa } = req.body;

  try {
    const etiqueta = await Etiqueta.findById(id);

    if (!etiqueta) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    // Verificar nombre único si se está cambiando
    if (nombre && nombre !== etiqueta.nombre) {
      const etiquetaExiste = await Etiqueta.findOne({
        nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
        _id: { $ne: id },
      });

      if (etiquetaExiste) {
        return res
          .status(400)
          .json({ message: "Ya existe una etiqueta con ese nombre" });
      }
    }

    const etiquetaActualizada = await Etiqueta.findByIdAndUpdate(
      id,
      {
        ...(nombre && { nombre: nombre.trim() }),
        ...(descripcion !== undefined && { descripcion }),
        ...(color && { color }),
        ...(icono && { icono }),
        ...(activa !== undefined && { activa }),
      },
      { new: true }
    );

    res.json(etiquetaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Eliminar etiqueta
// @route   DELETE /api/etiquetas/:id
// @access  Private (Admin)
const eliminarEtiqueta = async (req, res) => {
  const { id } = req.params;

  try {
    const etiqueta = await Etiqueta.findById(id);

    if (!etiqueta) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    // Verificar si hay materiales usando esta etiqueta
    const materialesConEtiqueta = await Material.countDocuments({
      etiquetas: id,
    });

    if (materialesConEtiqueta > 0) {
      // Desactivar en lugar de eliminar
      await Etiqueta.findByIdAndUpdate(id, { activa: false });
      return res.json({
        message: `Etiqueta desactivada. Estaba siendo usada por ${materialesConEtiqueta} material(es)`,
      });
    }

    // Si no se usa, eliminar completamente
    await Etiqueta.findByIdAndDelete(id);
    res.json({ message: "Etiqueta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener materiales por etiqueta
// @route   GET /api/etiquetas/:id/materiales
// @access  Private
const obtenerMaterialesPorEtiqueta = async (req, res) => {
  const { id } = req.params;

  try {
    const etiqueta = await Etiqueta.findById(id);

    if (!etiqueta) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    const materiales = await Material.find({ etiquetas: id })
      .populate("categoria", "nombre")
      .populate("nivel", "nombre")
      .populate("etiquetas", "nombre color icono")
      .sort({ nombre: 1 });

    res.json({
      etiqueta,
      materiales,
      total: materiales.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener estadísticas de etiquetas
// @route   GET /api/etiquetas/estadisticas
// @access  Private
const obtenerEstadisticasEtiquetas = async (req, res) => {
  try {
    const estadisticas = await Material.aggregate([
      { $unwind: "$etiquetas" },
      {
        $group: {
          _id: "$etiquetas",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "etiquetas",
          localField: "_id",
          foreignField: "_id",
          as: "etiqueta",
        },
      },
      { $unwind: "$etiqueta" },
      {
        $project: {
          _id: "$etiqueta._id",
          nombre: "$etiqueta.nombre",
          color: "$etiqueta.color",
          icono: "$etiqueta.icono",
          cantidadMateriales: "$count",
        },
      },
      { $sort: { cantidadMateriales: -1 } },
    ]);

    const totalEtiquetas = await Etiqueta.countDocuments({ activa: true });
    const etiquetasSinUso = await Etiqueta.find({
      activa: true,
      _id: { $nin: estadisticas.map((e) => e._id) },
    }).select("nombre color icono");

    res.json({
      estadisticas,
      totalEtiquetas,
      etiquetasEnUso: estadisticas.length,
      etiquetasSinUso,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  obtenerEtiquetas,
  crearEtiqueta,
  actualizarEtiqueta,
  eliminarEtiqueta,
  obtenerMaterialesPorEtiqueta,
  obtenerEstadisticasEtiquetas,
};
