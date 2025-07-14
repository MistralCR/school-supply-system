import axios from "axios";

const API_URL = "/api";

// Mock data para testing sin backend
const mockLists = [
  {
    _id: "1",
    nombre: "Lista 1er Grado 2024",
    descripcion: "Lista oficial para primer grado",
    nivel: { _id: "nivel1", nombre: "1er Grado" },
    createdBy: { _id: "prof1", nombre: "Prof. María García" },
    oficial: true,
    createdAt: "2024-01-15T00:00:00.000Z",
    materiales: [
      {
        material: {
          _id: "mat1",
          nombre: "Cuaderno rayado",
          precio: 1500,
          descripcion: "Cuaderno de 100 hojas rayado",
        },
        cantidad: 3,
      },
      {
        material: {
          _id: "mat2",
          nombre: "Lápices #2",
          precio: 800,
          descripcion: "Caja de 12 lápices",
        },
        cantidad: 2,
      },
    ],
  },
  {
    _id: "2",
    nombre: "Lista 2do Grado 2024",
    descripcion: "Lista oficial para segundo grado",
    nivel: { _id: "nivel2", nombre: "2do Grado" },
    createdBy: { _id: "prof2", nombre: "Prof. Carlos López" },
    oficial: true,
    createdAt: "2024-01-20T00:00:00.000Z",
    materiales: [
      {
        material: {
          _id: "mat3",
          nombre: "Colores",
          precio: 2500,
          descripcion: "Caja de 24 colores",
        },
        cantidad: 1,
      },
    ],
  },
];

const listsService = {
  // Obtener todas las listas
  getLists: async () => {
    try {
      // const response = await axios.get(`${API_URL}/lists`);
      // return response.data;

      // Mock response para testing
      return mockLists;
    } catch (error) {
      console.error("Error fetching lists:", error);
      return mockLists;
    }
  },

  // Obtener listas del usuario actual (profesor)
  getMyLists: async () => {
    try {
      // const response = await axios.get(`${API_URL}/lists/my`);
      // return response.data;

      // Mock response para testing
      return mockLists.filter((list) => list.createdBy._id === "prof1");
    } catch (error) {
      console.error("Error fetching my lists:", error);
      return mockLists.filter((list) => list.createdBy._id === "prof1");
    }
  },

  // Obtener listas oficiales
  getOficialLists: async () => {
    try {
      // const response = await axios.get(`${API_URL}/lists/oficial`);
      // return response.data;

      // Mock response para testing
      return mockLists.filter((list) => list.oficial);
    } catch (error) {
      console.error("Error fetching oficial lists:", error);
      return mockLists.filter((list) => list.oficial);
    }
  },

  // Obtener lista por ID
  getListById: async (id) => {
    try {
      // const response = await axios.get(`${API_URL}/lists/${id}`);
      // return response.data;

      // Mock response para testing
      return mockLists.find((list) => list._id === id);
    } catch (error) {
      console.error("Error fetching list by id:", error);
      return mockLists.find((list) => list._id === id);
    }
  },

  // Crear nueva lista (solo profesores)
  createList: async (listData) => {
    try {
      // const response = await axios.post(`${API_URL}/lists`, listData);
      // return response.data;

      // Mock response para testing
      const newList = {
        _id: Date.now().toString(),
        ...listData,
        createdBy: { _id: "prof1", nombre: "Prof. María García" },
        oficial: false,
        createdAt: new Date().toISOString(),
      };
      mockLists.push(newList);
      return newList;
    } catch (error) {
      console.error("Error creating list:", error);
      throw error;
    }
  },

  // Actualizar lista (solo profesores)
  updateList: async (id, listData) => {
    try {
      // const response = await axios.put(`${API_URL}/lists/${id}`, listData);
      // return response.data;

      // Mock response para testing
      const index = mockLists.findIndex((list) => list._id === id);
      if (index !== -1) {
        mockLists[index] = { ...mockLists[index], ...listData };
        return mockLists[index];
      }
      throw new Error("List not found");
    } catch (error) {
      console.error("Error updating list:", error);
      throw error;
    }
  },

  // Eliminar lista (solo profesores)
  deleteList: async (id) => {
    try {
      // const response = await axios.delete(`${API_URL}/lists/${id}`);
      // return response.data;

      // Mock response para testing
      const index = mockLists.findIndex((list) => list._id === id);
      if (index !== -1) {
        mockLists.splice(index, 1);
        return { message: "List deleted successfully" };
      }
      throw new Error("List not found");
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  },

  // Agregar material a lista (solo profesores)
  addMaterial: async (listId, materialData) => {
    try {
      // const response = await axios.post(`${API_URL}/lists/${listId}/materials`, materialData);
      // return response.data;

      // Mock response para testing
      const list = mockLists.find((l) => l._id === listId);
      if (list) {
        list.materiales.push(materialData);
        return list;
      }
      throw new Error("List not found");
    } catch (error) {
      console.error("Error adding material:", error);
      throw error;
    }
  },

  // Remover material de lista (solo profesores)
  removeMaterial: async (listId, materialId) => {
    try {
      // const response = await axios.delete(`${API_URL}/lists/${listId}/materials/${materialId}`);
      // return response.data;

      // Mock response para testing
      const list = mockLists.find((l) => l._id === listId);
      if (list) {
        list.materiales = list.materiales.filter(
          (m) => m.material._id !== materialId
        );
        return list;
      }
      throw new Error("List not found");
    } catch (error) {
      console.error("Error removing material:", error);
      throw error;
    }
  },

  // Obtener listas oficiales por nivel
  getListsByNivel: async (nivelId) => {
    try {
      // const response = await axios.get(`${API_URL}/lists/oficial/${nivelId}`);
      // return response.data;

      // Mock response para testing
      return mockLists.filter(
        (list) => list.oficial && list.nivel._id === nivelId
      );
    } catch (error) {
      console.error("Error fetching lists by nivel:", error);
      return mockLists.filter(
        (list) => list.oficial && list.nivel._id === nivelId
      );
    }
  },

  // Generar enlace para compartir
  generateShareLink: async (listId) => {
    try {
      // const response = await axios.get(`${API_URL}/lists/${listId}/share`);
      // return response.data;

      // Mock response para testing
      return {
        shareUrl: `https://example.com/shared/${listId}`,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    } catch (error) {
      console.error("Error generating share link:", error);
      throw error;
    }
  },

  // Exportar lista a PDF
  exportToPDF: async (listId) => {
    try {
      // const response = await axios.get(`${API_URL}/lists/${listId}/export`);
      // return response.data;

      // Mock response para testing
      return {
        downloadUrl: `https://example.com/exports/${listId}.pdf`,
      };
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw error;
    }
  },

  // Funciones específicas para padres
  marcarMaterialComprado: async (listId, materialId, compradoData) => {
    try {
      // const response = await axios.post(`${API_URL}/padre/lists/${listId}/materials/${materialId}/comprado`, compradoData);
      // return response.data;

      // Mock response para testing
      return { message: "Material marked as purchased" };
    } catch (error) {
      console.error("Error marking material as purchased:", error);
      throw error;
    }
  },

  enviarPorEmail: async (listId, emailData) => {
    try {
      // const response = await axios.post(`${API_URL}/padre/lists/${listId}/email`, emailData);
      // return response.data;

      // Mock response para testing
      return { message: "Email sent successfully" };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  getResumenCompras: async () => {
    try {
      // const response = await axios.get(`${API_URL}/padre/resumen`);
      // return response.data;

      // Mock response para testing
      return {
        totalListas: 3,
        totalGastado: 25000,
        materialesComprados: 15,
        ultimaCompra: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching purchase summary:", error);
      return {
        totalListas: 0,
        totalGastado: 0,
        materialesComprados: 0,
        ultimaCompra: null,
      };
    }
  },
};

export default listsService;
