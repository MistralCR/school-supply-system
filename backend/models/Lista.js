const mongoose = require("mongoose");

const listaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nivel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nivel",
    required: true,
  },
  materiales: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1,
      },
      comprado: {
        type: Boolean,
        default: false,
      },
      fechaCompra: {
        type: Date,
      },
    },
  ],
  totalEstimado: {
    type: Number,
    default: 0,
  },
  estado: {
    type: String,
    enum: ["pendiente", "en_proceso", "completada"],
    default: "pendiente",
  },
  tipoLista: {
    type: String,
    enum: ["oficial", "personal"],
    default: "personal",
  },
  esPublica: {
    type: Boolean,
    default: false,
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
listaSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

// Método para calcular total estimado
listaSchema.methods.calcularTotal = async function () {
  await this.populate("materiales.material");

  let total = 0;
  this.materiales.forEach((item) => {
    total += item.material.precio * item.cantidad;
  });

  this.totalEstimado = total;
  return total;
};

const Lista = mongoose.model("Lista", listaSchema);

module.exports = Lista;
