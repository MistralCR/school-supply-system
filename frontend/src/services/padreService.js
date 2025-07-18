import axios from "axios";

const API_URL = "/api";

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const padreService = {
  // Obtener listas asignadas al padre
  getMisListas: async () => {
    try {
      const response = await api.get("/padre/listas");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener listas";
    }
  },

  // Marcar útil como comprado
  marcarComprado: async (listaId, materialId, comprado = true) => {
    try {
      const response = await api.put(
        `/padre/listas/${listaId}/material/${materialId}`,
        {
          comprado,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al actualizar estado";
    }
  },

  // Obtener resumen de compras
  getResumenCompras: async () => {
    try {
      const response = await api.get("/padre/resumen");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener resumen";
    }
  },

  // Compartir lista por email
  compartirLista: async (listaId, email) => {
    try {
      const response = await api.post(`/padre/listas/${listaId}/compartir`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al compartir lista";
    }
  },

  // Datos simulados para desarrollo
  getMisListasSimulado: () => {
    return Promise.resolve([
      {
        _id: "1",
        titulo: "Lista de Útiles - 1er Grado",
        profesor: "Profesora García",
        grado: "1er Grado",
        fechaCreacion: "2025-01-10",
        materiales: [
          {
            _id: "m1",
            nombre: "Cuaderno rayado",
            cantidad: 2,
            comprado: true,
            precio: 1500,
          },
          {
            _id: "m2",
            nombre: "Lápices #2",
            cantidad: 5,
            comprado: false,
            precio: 2500,
          },
          {
            _id: "m3",
            nombre: "Borrador",
            cantidad: 2,
            comprado: true,
            precio: 800,
          },
          {
            _id: "m4",
            nombre: "Sacapuntas",
            cantidad: 1,
            comprado: false,
            precio: 1200,
          },
          {
            _id: "m5",
            nombre: "Regla 30cm",
            cantidad: 1,
            comprado: false,
            precio: 1800,
          },
        ],
        estado: "activa",
      },
      {
        _id: "2",
        titulo: "Lista de Arte - 1er Grado",
        profesor: "Profesor Martínez",
        grado: "1er Grado",
        fechaCreacion: "2025-01-15",
        materiales: [
          {
            _id: "m6",
            nombre: "Crayones",
            cantidad: 1,
            comprado: true,
            precio: 3000,
          },
          {
            _id: "m7",
            nombre: "Papel construcción",
            cantidad: 10,
            comprado: false,
            precio: 2000,
          },
          {
            _id: "m8",
            nombre: "Tijeras punta roma",
            cantidad: 1,
            comprado: false,
            precio: 2500,
          },
          {
            _id: "m9",
            nombre: "Pegamento en barra",
            cantidad: 2,
            comprado: true,
            precio: 1600,
          },
        ],
        estado: "activa",
      },
    ]);
  },

  // Método simulado para obtener resumen de compras
  getResumenComprasSimulado: () => {
    return Promise.resolve({
      totalGastado: 8900,
      totalPendiente: 11000,
      itemsComprados: 4,
      itemsPendientes: 5,
      progresoListas: [
        {
          titulo: "Lista de Útiles - 1er Grado",
          progreso: 60,
          comprados: 3,
          total: 5,
          gastado: 4800,
          totalPrecio: 8000,
        },
        {
          titulo: "Lista de Arte - 1er Grado",
          progreso: 50,
          comprados: 2,
          total: 4,
          gastado: 4600,
          totalPrecio: 9100,
        },
      ],
      historialCompras: [
        {
          fecha: "2025-01-25",
          nombreUtil: "Cuaderno rayado",
          lista: "Lista de Útiles - 1er Grado",
          cantidad: 2,
          precio: 3000,
        },
        {
          fecha: "2025-01-24",
          nombreUtil: "Crayones",
          lista: "Lista de Arte - 1er Grado",
          cantidad: 1,
          precio: 3000,
        },
        {
          fecha: "2025-01-23",
          nombreUtil: "Borrador",
          lista: "Lista de Útiles - 1er Grado",
          cantidad: 2,
          precio: 1600,
        },
        {
          fecha: "2025-01-22",
          nombreUtil: "Pegamento en barra",
          lista: "Lista de Arte - 1er Grado",
          cantidad: 2,
          precio: 3200,
        },
      ],
    });
  },

  // Método simulado para compartir lista
  compartirListaSimulado: ({ listaId, emails, mensaje, remitente }) => {
    return new Promise((resolve) => {
      // Simular delay de envío de email
      setTimeout(() => {
        console.log(`Lista ${listaId} compartida con:`, emails);
        console.log(`Mensaje: ${mensaje}`);
        console.log(`Remitente: ${remitente.nombre}`);
        resolve({
          success: true,
          message: `Lista compartida exitosamente con ${emails.length} destinatario(s)`,
        });
      }, 1500);
    });
  },
};

export default padreService;
