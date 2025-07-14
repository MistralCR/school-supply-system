const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

const createInitialUsers = async () => {
  try {
    await connectDB();

    // Verificar si ya existen usuarios
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log("ℹ️ Ya existen usuarios en la base de datos");
      console.log(`📊 Total de usuarios: ${existingUsers}`);
      process.exit(0);
    }

    console.log("🔧 Creando usuarios iniciales...");

    // Crear usuarios de prueba
    const users = [
      {
        nombre: "Administrador",
        email: "admin@escuela.com",
        password: await bcrypt.hash("admin123", 10),
        rol: "admin",
        activo: true,
      },
      {
        nombre: "Profesor García",
        email: "profesor@escuela.com",
        password: await bcrypt.hash("profesor123", 10),
        rol: "profesor",
        activo: true,
      },
      {
        nombre: "Juan Pérez",
        email: "padre@familia.com",
        password: await bcrypt.hash("padre123", 10),
        rol: "padre",
        activo: true,
      },
    ];

    const createdUsers = await User.insertMany(users);

    console.log("✅ Usuarios creados exitosamente:");
    createdUsers.forEach((user) => {
      console.log(`   - ${user.email} (${user.rol})`);
    });

    console.log("\n🔑 Credenciales de acceso:");
    console.log("   Admin: admin@escuela.com / admin123");
    console.log("   Profesor: profesor@escuela.com / profesor123");
    console.log("   Padre: padre@familia.com / padre123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creando usuarios:", error.message);
    process.exit(1);
  }
};

createInitialUsers();
