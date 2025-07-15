const mongoose = require("mongoose");

const materialSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  nivel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nivel",
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    default: 0,
  },
  imagen: {
    type: String,
  },
  etiquetas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Etiqueta",
    },
  ],
  disponible: {
    type: Boolean,
    default: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar fecha de modificación
materialSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
