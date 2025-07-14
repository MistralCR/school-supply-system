require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function updateIndexes() {
  try {
    console.log("🔍 Actualizando índices para cédula obligatoria...");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Eliminar índice anterior (sparse)
    try {
      await User.collection.dropIndex("cedula_unique");
      console.log("🗑️ Índice anterior (sparse) eliminado");
    } catch (error) {
      console.log("ℹ️ No hay índice anterior para eliminar");
    }

    // Crear nuevo índice único sin sparse (para campos obligatorios)
    await User.collection.createIndex(
      { cedula: 1 },
      {
        unique: true,
        name: "cedula_required_unique",
      }
    );

    console.log("✅ Índice único para cédula obligatoria creado exitosamente");

    // Verificar usuarios sin cédula
    const usersWithoutCedula = await User.find({
      $or: [{ cedula: null }, { cedula: undefined }, { cedula: "" }],
    });

    if (usersWithoutCedula.length > 0) {
      console.log(
        `⚠️ Advertencia: ${usersWithoutCedula.length} usuarios sin cédula encontrados:`
      );
      usersWithoutCedula.forEach((user) => {
        console.log(`  - ${user.nombre} (${user.email})`);
      });
      console.log("💡 Considera asignar cédulas a estos usuarios existentes");
    } else {
      console.log("✅ Todos los usuarios tienen cédula");
    }
  } catch (error) {
    console.error("❌ Error actualizando índices:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

updateIndexes();
