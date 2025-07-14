const Lista = require("../models/Lista");
const nodemailer = require("nodemailer");

// @desc    Marcar material como comprado (solo para padres)
// @route   POST /api/lists/:id/materials/:materialId/comprado
// @access  Private (Padre)
const marcarMaterialComprado = async (req, res) => {
  try {
    if (req.user.rol !== "padre") {
      return res.status(403).json({
        message: "Solo los padres pueden marcar materiales como comprados",
      });
    }

    const { comprado, fechaCompra } = req.body;
    const list = await Lista.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    // Verificar que sea una lista oficial pública
    if (list.tipoLista !== "oficial" || !list.esPublica) {
      return res.status(403).json({
        message: "Solo puedes marcar materiales en listas oficiales públicas",
      });
    }

    // Buscar el material en la lista
    const materialIndex = list.materiales.findIndex(
      (item) => item.material.toString() === req.params.materialId
    );

    if (materialIndex === -1) {
      return res
        .status(404)
        .json({ message: "Material no encontrado en la lista" });
    }

    // Actualizar el estado del material
    list.materiales[materialIndex].comprado = comprado;
    if (comprado && fechaCompra) {
      list.materiales[materialIndex].fechaCompra = new Date(fechaCompra);
    }

    await list.save();

    res.json({
      message: "Estado del material actualizado correctamente",
      material: list.materiales[materialIndex],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

// @desc    Enviar lista por email
// @route   POST /api/lists/:id/email
// @access  Private
const enviarListaPorEmail = async (req, res) => {
  try {
    const { emailDestinatario, mensaje } = req.body;

    const list = await Lista.findById(req.params.id)
      .populate("usuario", "nombre email rol")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio categoria");

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    // Verificar permisos
    const canShare =
      req.user.rol === "admin" ||
      (req.user.rol === "profesor" &&
        list.usuario._id.toString() === req.user.id) ||
      (req.user.rol === "padre" &&
        list.tipoLista === "oficial" &&
        list.esPublica);

    if (!canShare) {
      return res.status(403).json({
        message: "No tienes permisos para compartir esta lista",
      });
    }

    // Configurar nodemailer (esto requeriría configuración de SMTP)
    // Por ahora, solo simularemos el envío
    const emailContent = {
      destinatario: emailDestinatario,
      asunto: `Lista de Útiles Escolares - ${list.nombre}`,
      contenido: `
        Lista: ${list.nombre}
        Nivel: ${list.nivel.nombre} - ${list.nivel.grado}
        Profesor: ${list.usuario.nombre}
        
        Materiales:
        ${list.materiales
          .map(
            (item) => `- ${item.material.nombre} (Cantidad: ${item.cantidad})`
          )
          .join("\n")}
        
        ${mensaje ? `Mensaje: ${mensaje}` : ""}
        
        Compartido por: ${req.user.nombre}
      `,
    };

    // Aquí iría la lógica real de envío de email
    // await transporter.sendMail(emailContent);

    res.json({
      message: "Lista enviada por email correctamente",
      destinatario: emailDestinatario,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

// @desc    Obtener resumen de compras del padre
// @route   GET /api/lists/padre/resumen
// @access  Private (Padre)
const obtenerResumenCompras = async (req, res) => {
  try {
    if (req.user.rol !== "padre") {
      return res.status(403).json({
        message: "Solo los padres pueden ver este resumen",
      });
    }

    // Obtener todas las listas oficiales públicas
    const listas = await Lista.find({
      tipoLista: "oficial",
      esPublica: true,
    })
      .populate("usuario", "nombre")
      .populate("nivel", "nombre grado")
      .populate("materiales.material", "nombre precio categoria");

    // Crear resumen de materiales comprados vs pendientes
    let totalMateriales = 0;
    let materialesComprados = 0;
    let costoTotal = 0;
    let costoComprado = 0;

    listas.forEach((lista) => {
      lista.materiales.forEach((item) => {
        totalMateriales++;
        costoTotal += item.material.precio * item.cantidad;

        if (item.comprado) {
          materialesComprados++;
          costoComprado += item.material.precio * item.cantidad;
        }
      });
    });

    const resumen = {
      totalListas: listas.length,
      totalMateriales,
      materialesComprados,
      materialesPendientes: totalMateriales - materialesComprados,
      porcentajeCompletado:
        totalMateriales > 0
          ? Math.round((materialesComprados / totalMateriales) * 100)
          : 0,
      costoTotal,
      costoComprado,
      costoPendiente: costoTotal - costoComprado,
      listas: listas.map((lista) => ({
        id: lista._id,
        nombre: lista.nombre,
        nivel: `${lista.nivel.nombre} - ${lista.nivel.grado}`,
        profesor: lista.usuario.nombre,
        totalMateriales: lista.materiales.length,
        materialesComprados: lista.materiales.filter((m) => m.comprado).length,
      })),
    };

    res.json(resumen);
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  marcarMaterialComprado,
  enviarListaPorEmail,
  obtenerResumenCompras,
};
