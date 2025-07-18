require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function crearUsuariosPrueba() {
  try {
    console.log("👥 Creando usuarios de prueba...");

    // Verificar si ya existen usuarios
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      console.log("🔍 Ya existen usuarios:", existingUsers.length);

      // Mostrar usuarios existentes
      existingUsers.forEach((user) => {
        console.log(`- ${user.nombre} (${user.email}) - Rol: ${user.rol}`);
      });

      return;
    }

    const usuarios = [
      {
        nombre: "Administrador del Sistema",
        email: "admin@test.com",
        password: "admin123",
        cedula: "123456789",
        telefono: "88888888",
        direccion: "San José, Costa Rica",
        rol: "admin",
      },
      {
        nombre: "María García",
        email: "profesor@test.com",
        password: "profesor123",
        cedula: "234567890",
        telefono: "77777777",
        direccion: "Cartago, Costa Rica",
        rol: "profesor",
      },
      {
        nombre: "Juan Pérez",
        email: "padre@test.com",
        password: "padre123",
        cedula: "345678901",
        telefono: "66666666",
        direccion: "Heredia, Costa Rica",
        rol: "padre",
      },
      {
        nombre: "Ana Martínez",
        email: "coordinador@test.com",
        password: "coord123",
        cedula: "456789012",
        telefono: "55555555",
        direccion: "Alajuela, Costa Rica",
        rol: "coordinador",
      },
    ];

    const usuariosCreados = [];
    for (const userData of usuarios) {
      try {
        const user = await User.create(userData);
        usuariosCreados.push(user);
        console.log(`✅ Usuario creado: ${user.nombre} (${user.rol})`);
      } catch (error) {
        console.log(
          `❌ Error creando usuario ${userData.nombre}: ${error.message}`
        );
      }
    }

    console.log(`\n🎉 Usuarios creados: ${usuariosCreados.length}`);
    console.log("\n📋 Credenciales de acceso:");
    console.log("Admin: admin@test.com / admin123");
    console.log("Profesor: profesor@test.com / profesor123");
    console.log("Padre: padre@test.com / padre123");
    console.log("Coordinador: coordinador@test.com / coord123");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

crearUsuariosPrueba();
