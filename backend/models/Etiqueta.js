const mongoose = require("mongoose");

const etiquetaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    default: "#007bff", // Color por defecto (azul)
    validate: {
      validator: function (v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: "El color debe ser un código hexadecimal válido",
    },
  },
  icono: {
    type: String, // Icono de Bootstrap o FontAwesome
    default: "tag",
  },
  activa: {
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
etiquetaSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

const Etiqueta = mongoose.model("Etiqueta", etiquetaSchema);

module.exports = Etiqueta;
