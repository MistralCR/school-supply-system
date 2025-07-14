require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createIndexes() {
  try {
    console.log("🔍 Creando índices únicos...");

    // Eliminar índice existente si existe
    try {
      await User.collection.dropIndex("cedula_1");
      console.log("🗑️ Índice anterior eliminado");
    } catch (error) {
      console.log("ℹ️ No hay índice anterior para eliminar");
    }

    // Crear índice único para cédula (sparse permite valores nulos únicos)
    await User.collection.createIndex(
      { cedula: 1 },
      {
        unique: true,
        sparse: true,
        name: "cedula_unique",
      }
    );

    console.log("✅ Índice único para cédula creado exitosamente");

    // Verificar usuarios con cédulas duplicadas
    const duplicateCedulas = await User.aggregate([
      { $match: { cedula: { $exists: true, $ne: null, $ne: "" } } },
      {
        $group: {
          _id: "$cedula",
          count: { $sum: 1 },
          users: { $push: "$$ROOT" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicateCedulas.length > 0) {
      console.log("⚠️ Cédulas duplicadas encontradas:", duplicateCedulas);
    } else {
      console.log("✅ No hay cédulas duplicadas");
    }

    // Mostrar todos los usuarios con cédula
    const usersWithCedula = await User.find({
      cedula: { $exists: true, $ne: null, $ne: "" },
    });
    console.log(
      "📋 Usuarios con cédula:",
      usersWithCedula.map((u) => ({
        nombre: u.nombre,
        email: u.email,
        cedula: u.cedula,
      }))
    );
  } catch (error) {
    console.error("❌ Error creando índices:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

createIndexes();
