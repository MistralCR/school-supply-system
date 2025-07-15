require("dotenv").config();
const mongoose = require("mongoose");
const Etiqueta = require("./models/Etiqueta");

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function crearEtiquetasPredeterminadas() {
  try {
    console.log("🏷️ Creando etiquetas predeterminadas...");

    const etiquetasPredeterminadas = [
      {
        nombre: "Básico",
        descripcion: "Materiales básicos esenciales para el curso",
        color: "#28a745",
        icono: "check-circle",
      },
      {
        nombre: "Opcional",
        descripcion: "Materiales opcionales o complementarios",
        color: "#6c757d",
        icono: "plus-circle",
      },
      {
        nombre: "Urgente",
        descripcion: "Materiales que se necesitan con urgencia",
        color: "#dc3545",
        icono: "exclamation-triangle",
      },
      {
        nombre: "Arte",
        descripcion: "Materiales para actividades artísticas",
        color: "#e83e8c",
        icono: "palette",
      },
      {
        nombre: "Ciencias",
        descripcion: "Materiales para actividades científicas",
        color: "#007bff",
        icono: "flask",
      },
      {
        nombre: "Matemáticas",
        descripcion: "Materiales para matemáticas",
        color: "#17a2b8",
        icono: "calculator",
      },
      {
        nombre: "Deportes",
        descripcion: "Materiales para educación física",
        color: "#fd7e14",
        icono: "basketball",
      },
      {
        nombre: "Tecnología",
        descripcion: "Materiales tecnológicos o digitales",
        color: "#6f42c1",
        icono: "laptop",
      },
      {
        nombre: "Economico",
        descripcion: "Materiales de bajo costo",
        color: "#20c997",
        icono: "dollar-sign",
      },
      {
        nombre: "Premium",
        descripcion: "Materiales de alta calidad",
        color: "#ffc107",
        icono: "star",
      },
    ];

    for (const etiquetaData of etiquetasPredeterminadas) {
      const etiquetaExiste = await Etiqueta.findOne({
        nombre: { $regex: new RegExp(`^${etiquetaData.nombre}$`, "i") },
      });

      if (!etiquetaExiste) {
        const etiqueta = await Etiqueta.create(etiquetaData);
        console.log(`✅ Etiqueta creada: ${etiqueta.nombre}`);
      } else {
        console.log(`ℹ️ Etiqueta ya existe: ${etiquetaData.nombre}`);
      }
    }

    console.log("🎉 Etiquetas predeterminadas creadas exitosamente");

    // Mostrar resumen
    const totalEtiquetas = await Etiqueta.countDocuments();
    console.log(`📊 Total de etiquetas en la base de datos: ${totalEtiquetas}`);
  } catch (error) {
    console.error("❌ Error creando etiquetas:", error);
  } finally {
    mongoose.connection.close();
  }
}

crearEtiquetasPredeterminadas();
