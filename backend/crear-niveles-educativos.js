require("dotenv").config();
const mongoose = require("mongoose");
const Nivel = require("./models/Nivel");

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function crearNivelesEducativos() {
  try {
    console.log("🎓 Creando niveles educativos completos...");

    // Verificar si ya existen niveles
    const existingLevels = await Nivel.find();
    if (existingLevels.length > 0) {
      console.log("🔍 Niveles existentes encontrados:", existingLevels.length);

      // Mostrar niveles existentes
      existingLevels.forEach((level) => {
        console.log(
          `- ${level.nombre} (${level.grado}) - Orden: ${level.orden}`
        );
      });

      const respuesta = await new Promise((resolve) => {
        const readline = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        readline.question(
          "\n¿Deseas reemplazar los niveles existentes? (s/n): ",
          (answer) => {
            readline.close();
            resolve(
              answer.toLowerCase() === "s" || answer.toLowerCase() === "si"
            );
          }
        );
      });

      if (!respuesta) {
        console.log("❌ Operación cancelada.");
        return;
      }

      // Eliminar niveles existentes
      await Nivel.deleteMany({});
      console.log("🗑️ Niveles existentes eliminados.");
    }

    const niveles = [
      // Educación Inicial
      {
        nombre: "Materno",
        grado: "Materno",
        descripcion: "Educación inicial para niños de 2-3 años",
        orden: 1,
        activo: true,
      },
      {
        nombre: "Preescolar",
        grado: "Kinder",
        descripcion: "Educación preescolar para niños de 4-5 años",
        orden: 2,
        activo: true,
      },
      {
        nombre: "Preparatoria",
        grado: "Preparatoria",
        descripcion: "Nivel de transición a primaria para niños de 5-6 años",
        orden: 3,
        activo: true,
      },

      // Educación Primaria
      {
        nombre: "Primero",
        grado: "1°",
        descripcion: "Primer grado de educación primaria",
        orden: 4,
        activo: true,
      },
      {
        nombre: "Segundo",
        grado: "2°",
        descripcion: "Segundo grado de educación primaria",
        orden: 5,
        activo: true,
      },
      {
        nombre: "Tercero",
        grado: "3°",
        descripcion: "Tercer grado de educación primaria",
        orden: 6,
        activo: true,
      },
      {
        nombre: "Cuarto",
        grado: "4°",
        descripcion: "Cuarto grado de educación primaria",
        orden: 7,
        activo: true,
      },
      {
        nombre: "Quinto",
        grado: "5°",
        descripcion: "Quinto grado de educación primaria",
        orden: 8,
        activo: true,
      },
      {
        nombre: "Sexto",
        grado: "6°",
        descripcion: "Sexto grado de educación primaria",
        orden: 9,
        activo: true,
      },

      // Educación Secundaria
      {
        nombre: "Sétimo",
        grado: "7°",
        descripcion: "Primer año de educación secundaria",
        orden: 10,
        activo: true,
      },
      {
        nombre: "Octavo",
        grado: "8°",
        descripcion: "Segundo año de educación secundaria",
        orden: 11,
        activo: true,
      },
      {
        nombre: "Noveno",
        grado: "9°",
        descripcion: "Tercer año de educación secundaria",
        orden: 12,
        activo: true,
      },
      {
        nombre: "Décimo",
        grado: "10°",
        descripcion: "Cuarto año de educación secundaria",
        orden: 13,
        activo: true,
      },
      {
        nombre: "Undécimo",
        grado: "11°",
        descripcion: "Quinto año de educación secundaria",
        orden: 14,
        activo: true,
      },
      {
        nombre: "Duodécimo",
        grado: "12°",
        descripcion: "Sexto año de educación secundaria (último año)",
        orden: 15,
        activo: true,
      },
    ];

    console.log(`\n📚 Creando ${niveles.length} niveles educativos...\n`);

    const nivelesCreados = [];
    for (const nivelData of niveles) {
      try {
        const nivel = await Nivel.create(nivelData);
        nivelesCreados.push(nivel);
        console.log(
          `✅ ${nivelData.nombre} (${nivelData.grado}) - Orden: ${nivelData.orden}`
        );
      } catch (error) {
        console.log(`❌ Error creando ${nivelData.nombre}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Niveles educativos creados: ${nivelesCreados.length}`);

    console.log("\n📋 Estructura educativa completa:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌱 EDUCACIÓN INICIAL:");
    console.log("   • Materno (2-3 años)");
    console.log("   • Preescolar/Kinder (4-5 años)");
    console.log("   • Preparatoria (5-6 años)");
    console.log("\n📚 EDUCACIÓN PRIMARIA:");
    console.log("   • 1° a 6° grado (6-12 años)");
    console.log("\n🎓 EDUCACIÓN SECUNDARIA:");
    console.log("   • 7° a 12° año (13-18 años)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

crearNivelesEducativos();
