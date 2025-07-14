const mongoose = require("mongoose");

const nivelSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  grado: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  orden: {
    type: Number,
    required: true,
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

const Nivel = mongoose.model("Nivel", nivelSchema);

module.exports = Nivel;
