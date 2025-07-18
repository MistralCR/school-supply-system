require("dotenv").config();
const mongoose = require("mongoose");
const Categoria = require("./models/Categoria");
const Nivel = require("./models/Nivel");
const Material = require("./models/Material");
const Etiqueta = require("./models/Etiqueta");

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function inicializarDatos() {
  try {
    console.log("🚀 Inicializando datos de prueba...");

    // 1. Crear Categorías
    console.log("📂 Creando categorías...");
    const categorias = [
      {
        nombre: "Útiles Escolares",
        descripcion: "Materiales básicos para el estudio",
      },
      {
        nombre: "Arte y Manualidades",
        descripcion: "Materiales para actividades artísticas",
      },
      {
        nombre: "Ciencias",
        descripcion: "Materiales para experimentos y ciencias",
      },
      { nombre: "Deportes", descripcion: "Materiales para educación física" },
      {
        nombre: "Tecnología",
        descripcion: "Materiales tecnológicos y digitales",
      },
    ];

    const categoriasCreadas = [];
    for (const catData of categorias) {
      let categoria = await Categoria.findOne({ nombre: catData.nombre });
      if (!categoria) {
        categoria = await Categoria.create(catData);
        console.log(`  ✅ Categoría creada: ${categoria.nombre}`);
      } else {
        console.log(`  ℹ️ Categoría ya existe: ${categoria.nombre}`);
      }
      categoriasCreadas.push(categoria);
    }

    // 2. Crear Niveles
    console.log("🎓 Creando niveles...");
    const niveles = [
      {
        nombre: "Preescolar",
        grado: "Kinder",
        descripcion: "Educación inicial",
        orden: 1,
      },
      {
        nombre: "Primero",
        grado: "1°",
        descripcion: "Primer grado de primaria",
        orden: 2,
      },
      {
        nombre: "Segundo",
        grado: "2°",
        descripcion: "Segundo grado de primaria",
        orden: 3,
      },
      {
        nombre: "Tercero",
        grado: "3°",
        descripcion: "Tercer grado de primaria",
        orden: 4,
      },
      {
        nombre: "Cuarto",
        grado: "4°",
        descripcion: "Cuarto grado de primaria",
        orden: 5,
      },
      {
        nombre: "Quinto",
        grado: "5°",
        descripcion: "Quinto grado de primaria",
        orden: 6,
      },
      {
        nombre: "Sexto",
        grado: "6°",
        descripcion: "Sexto grado de primaria",
        orden: 7,
      },
    ];

    const nivelesCreados = [];
    for (const nivelData of niveles) {
      let nivel = await Nivel.findOne({ nombre: nivelData.nombre });
      if (!nivel) {
        nivel = await Nivel.create(nivelData);
        console.log(`  ✅ Nivel creado: ${nivel.nombre} (${nivel.grado})`);
      } else {
        console.log(`  ℹ️ Nivel ya existe: ${nivel.nombre}`);
      }
      nivelesCreados.push(nivel);
    }

    // 3. Obtener etiquetas existentes
    console.log("🏷️ Obteniendo etiquetas...");
    const etiquetas = await Etiqueta.find({});
    console.log(`  📊 Etiquetas disponibles: ${etiquetas.length}`);

    // 4. Crear Materiales
    console.log("📝 Creando materiales...");
    const materiales = [
      // Útiles Escolares Básicos
      {
        nombre: "Cuaderno de 100 hojas",
        descripcion: "Cuaderno rayado para uso general",
        categoria: categoriasCreadas[0]._id,
        nivel: nivelesCreados[1]._id, // Primero
        precio: 2500,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Básico")?._id,
          etiquetas.find((e) => e.nombre === "Economico")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "Lápices #2 (paquete de 12)",
        descripcion: "Lápices de grafito para escritura",
        categoria: categoriasCreadas[0]._id,
        nivel: nivelesCreados[0]._id, // Preescolar
        precio: 1800,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Básico")?._id,
          etiquetas.find((e) => e.nombre === "Urgente")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "Borrador blanco",
        descripcion: "Borrador para lápiz y grafito",
        categoria: categoriasCreadas[0]._id,
        nivel: nivelesCreados[1]._id,
        precio: 500,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Básico")?._id,
          etiquetas.find((e) => e.nombre === "Economico")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "Regla de 30cm",
        descripcion: "Regla plástica transparente",
        categoria: categoriasCreadas[0]._id,
        nivel: nivelesCreados[2]._id, // Segundo
        precio: 800,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Matemáticas")?._id,
          etiquetas.find((e) => e.nombre === "Básico")?._id,
        ].filter(Boolean),
        disponible: true,
      },

      // Arte y Manualidades
      {
        nombre: "Crayones de 24 colores",
        descripcion: "Set de crayones para colorear",
        categoria: categoriasCreadas[1]._id,
        nivel: nivelesCreados[0]._id, // Preescolar
        precio: 3200,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Arte")?._id,
          etiquetas.find((e) => e.nombre === "Básico")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "Témperas x 6 colores",
        descripcion: "Pinturas témpera lavables",
        categoria: categoriasCreadas[1]._id,
        nivel: nivelesCreados[1]._id,
        precio: 4500,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Arte")?._id,
          etiquetas.find((e) => e.nombre === "Opcional")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "Papel construcción (50 hojas)",
        descripcion: "Papel de colores para manualidades",
        categoria: categoriasCreadas[1]._id,
        nivel: nivelesCreados[2]._id,
        precio: 2800,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Arte")?._id,
          etiquetas.find((e) => e.nombre === "Opcional")?._id,
        ].filter(Boolean),
        disponible: true,
      },

      // Ciencias
      {
        nombre: "Microscopio básico",
        descripcion: "Microscopio para observación básica",
        categoria: categoriasCreadas[2]._id,
        nivel: nivelesCreados[4]._id, // Cuarto
        precio: 15000,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Ciencias")?._id,
          etiquetas.find((e) => e.nombre === "Premium")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "Kit de experimentos",
        descripcion: "Set básico para experimentos científicos",
        categoria: categoriasCreadas[2]._id,
        nivel: nivelesCreados[3]._id, // Tercero
        precio: 8500,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Ciencias")?._id,
          etiquetas.find((e) => e.nombre === "Opcional")?._id,
        ].filter(Boolean),
        disponible: true,
      },

      // Deportes
      {
        nombre: "Pelota de fútbol",
        descripcion: "Pelota reglamentaria para educación física",
        categoria: categoriasCreadas[3]._id,
        nivel: nivelesCreados[5]._id, // Quinto
        precio: 12000,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Deportes")?._id,
          etiquetas.find((e) => e.nombre === "Opcional")?._id,
        ].filter(Boolean),
        disponible: true,
      },

      // Tecnología
      {
        nombre: "Calculadora científica",
        descripcion: "Calculadora para matemáticas avanzadas",
        categoria: categoriasCreadas[4]._id,
        nivel: nivelesCreados[6]._id, // Sexto
        precio: 18000,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Tecnología")?._id,
          etiquetas.find((e) => e.nombre === "Matemáticas")?._id,
          etiquetas.find((e) => e.nombre === "Premium")?._id,
        ].filter(Boolean),
        disponible: true,
      },
      {
        nombre: "USB 16GB",
        descripcion: "Memoria USB para proyectos digitales",
        categoria: categoriasCreadas[4]._id,
        nivel: nivelesCreados[5]._id,
        precio: 8000,
        etiquetas: [
          etiquetas.find((e) => e.nombre === "Tecnología")?._id,
          etiquetas.find((e) => e.nombre === "Opcional")?._id,
        ].filter(Boolean),
        disponible: true,
      },
    ];

    let materialesCreados = 0;
    for (const materialData of materiales) {
      const materialExiste = await Material.findOne({
        nombre: materialData.nombre,
      });
      if (!materialExiste) {
        const material = await Material.create(materialData);
        console.log(
          `  ✅ Material creado: ${material.nombre} - $${material.precio}`
        );
        materialesCreados++;
      } else {
        console.log(`  ℹ️ Material ya existe: ${materialData.nombre}`);
      }
    }

    // Resumen
    console.log("\n🎉 Inicialización completada!");
    console.log(`📊 Resumen:`);
    console.log(`  - Categorías: ${categoriasCreadas.length}`);
    console.log(`  - Niveles: ${nivelesCreados.length}`);
    console.log(`  - Etiquetas: ${etiquetas.length}`);
    console.log(`  - Materiales nuevos: ${materialesCreados}`);
    console.log(`  - Total materiales: ${await Material.countDocuments()}`);
  } catch (error) {
    console.error("❌ Error inicializando datos:", error);
  } finally {
    mongoose.connection.close();
  }
}

inicializarDatos();
