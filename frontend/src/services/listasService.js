import axios from "axios";

const API_URL = "/api";

const listasService = {
  // Obtener todas las listas
  getListas: async () => {
    const response = await axios.get(`${API_URL}/lists`);
    return response.data;
  },

  // Obtener lista por ID
  getListaById: async (id) => {
    const response = await axios.get(`${API_URL}/lists/${id}`);
    return response.data;
  },

  // Crear nueva lista (solo profesores)
  createLista: async (listaData) => {
    const response = await axios.post(`${API_URL}/lists`, listaData);
    return response.data;
  },

  // Actualizar lista (solo profesores)
  updateLista: async (id, listaData) => {
    const response = await axios.put(`${API_URL}/lists/${id}`, listaData);
    return response.data;
  },

  // Eliminar lista (solo profesores)
  deleteLista: async (id) => {
    const response = await axios.delete(`${API_URL}/lists/${id}`);
    return response.data;
  },

  // Agregar material a lista (solo profesores)
  addMaterial: async (listaId, materialData) => {
    const response = await axios.post(
      `${API_URL}/lists/${listaId}/materials`,
      materialData
    );
    return response.data;
  },

  // Remover material de lista (solo profesores)
  removeMaterial: async (listaId, materialId) => {
    const response = await axios.delete(
      `${API_URL}/lists/${listaId}/materials/${materialId}`
    );
    return response.data;
  },

  // Obtener listas oficiales por nivel
  getListasByNivel: async (nivelId) => {
    const response = await axios.get(`${API_URL}/lists/oficial/${nivelId}`);
    return response.data;
  },

  // Generar enlace para compartir
  generateShareLink: async (listaId) => {
    const response = await axios.get(`${API_URL}/lists/${listaId}/share`);
    return response.data;
  },

  // Exportar lista a PDF
  exportToPDF: async (listaId) => {
    const response = await axios.get(`${API_URL}/lists/${listaId}/export`);
    return response.data;
  },

  // Funciones específicas para padres
  marcarMaterialComprado: async (listaId, materialId, compradoData) => {
    const response = await axios.post(
      `${API_URL}/padre/lists/${listaId}/materials/${materialId}/comprado`,
      compradoData
    );
    return response.data;
  },

  enviarPorEmail: async (listaId, emailData) => {
    const response = await axios.post(
      `${API_URL}/padre/lists/${listaId}/email`,
      emailData
    );
    return response.data;
  },

  getResumenCompras: async () => {
    const response = await axios.get(`${API_URL}/padre/resumen`);
    return response.data;
  },
};

export default listasService;
