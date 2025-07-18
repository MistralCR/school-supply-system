import axios from "axios";

const API_URL = "/api/categories";

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

const categoriesService = {
  // Obtener todas las categorías
  getCategories: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener categorías";
    }
  },

  // Obtener categoría por ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener categoría";
    }
  },

  // Crear nueva categoría
  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/", categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al crear categoría";
    }
  },

  // Actualizar categoría
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al actualizar categoría";
    }
  },

  // Eliminar categoría
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al eliminar categoría";
    }
  },
};

export default categoriesService;
