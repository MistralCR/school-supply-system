const mongoose = require("mongoose");

const categoriaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
  },
  icono: {
    type: String,
  },
  color: {
    type: String,
    default: "#3498db",
  },
  orden: {
    type: Number,
    default: 0,
  },
  activo: {
    type: Boolean,
    default: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const Categoria = mongoose.model("Categoria", categoriaSchema);

module.exports = Categoria;
