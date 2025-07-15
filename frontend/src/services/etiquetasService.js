import axios from "axios";

const API_URL = "/api/etiquetas";

// Obtener todas las etiquetas
export const obtenerEtiquetas = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al obtener etiquetas";
  }
};

// Crear nueva etiqueta
export const crearEtiqueta = async (etiquetaData) => {
  try {
    const response = await axios.post(API_URL, etiquetaData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al crear etiqueta";
  }
};

// Actualizar etiqueta
export const actualizarEtiqueta = async (id, etiquetaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, etiquetaData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al actualizar etiqueta";
  }
};

// Eliminar etiqueta
export const eliminarEtiqueta = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al eliminar etiqueta";
  }
};

// Obtener materiales por etiqueta
export const obtenerMaterialesPorEtiqueta = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/materiales`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Error al obtener materiales por etiqueta"
    );
  }
};

// Obtener estadísticas de etiquetas
export const obtenerEstadisticasEtiquetas = async () => {
  try {
    const response = await axios.get(`${API_URL}/estadisticas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Error al obtener estadísticas de etiquetas"
    );
  }
};

// Filtrar materiales por etiquetas
export const filtrarMaterialesPorEtiquetas = async (filtros) => {
  try {
    const params = new URLSearchParams();

    if (filtros.etiqueta) params.append("etiqueta", filtros.etiqueta);
    if (filtros.categoria) params.append("categoria", filtros.categoria);
    if (filtros.nivel) params.append("nivel", filtros.nivel);
    if (filtros.disponible !== undefined)
      params.append("disponible", filtros.disponible);

    const response = await axios.get(`/api/materials?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al filtrar materiales";
  }
};

export default {
  obtenerEtiquetas,
  crearEtiqueta,
  actualizarEtiqueta,
  eliminarEtiqueta,
  obtenerMaterialesPorEtiqueta,
  obtenerEstadisticasEtiquetas,
  filtrarMaterialesPorEtiquetas,
};
