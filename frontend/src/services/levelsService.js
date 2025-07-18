import axios from "axios";

const API_URL = "/api/levels";

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

const levelsService = {
  // Obtener todos los niveles
  getLevels: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener niveles";
    }
  },

  // Obtener nivel por ID
  getLevelById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener nivel";
    }
  },

  // Crear nuevo nivel
  createLevel: async (levelData) => {
    try {
      const response = await api.post("/", levelData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al crear nivel";
    }
  },

  // Actualizar nivel
  updateLevel: async (id, levelData) => {
    try {
      const response = await api.put(`/${id}`, levelData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al actualizar nivel";
    }
  },

  // Eliminar nivel
  deleteLevel: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al eliminar nivel";
    }
  },
};

export default levelsService;
