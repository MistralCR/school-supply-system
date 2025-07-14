import axios from "axios";

const API_URL = "/api";

const materialsService = {
  // Obtener todos los materiales
  getMaterials: async () => {
    const response = await axios.get(`${API_URL}/materials`);
    return response.data;
  },

  // Obtener material por ID
  getMaterialById: async (id) => {
    const response = await axios.get(`${API_URL}/materials/${id}`);
    return response.data;
  },

  // Crear nuevo material (solo profesores)
  createMaterial: async (materialData) => {
    const response = await axios.post(`${API_URL}/materials`, materialData);
    return response.data;
  },

  // Actualizar material (solo profesores)
  updateMaterial: async (id, materialData) => {
    const response = await axios.put(
      `${API_URL}/materials/${id}`,
      materialData
    );
    return response.data;
  },

  // Eliminar material (solo profesores)
  deleteMaterial: async (id) => {
    const response = await axios.delete(`${API_URL}/materials/${id}`);
    return response.data;
  },

  // Obtener materiales por categoría
  getMaterialsByCategory: async (categoryId) => {
    const response = await axios.get(
      `${API_URL}/materials/categoria/${categoryId}`
    );
    return response.data;
  },

  // Obtener materiales por nivel
  getMaterialsByLevel: async (levelId) => {
    const response = await axios.get(`${API_URL}/materials/nivel/${levelId}`);
    return response.data;
  },
};

export default materialsService;
