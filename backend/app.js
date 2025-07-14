const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/materials", require("./routes/materialRoutes"));
app.use("/api/lists", require("./routes/listaRoutes"));
app.use("/api/padre", require("./routes/padreRoutes"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API del Sistema de Útiles Escolares funcionando" });
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

module.exports = app;
