const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`📚 Entorno: ${process.env.NODE_ENV || "development"}`);
});
