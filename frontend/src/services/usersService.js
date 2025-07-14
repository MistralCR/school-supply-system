import axios from "axios";

const API_URL = "/api";

const usersService = {
  // Obtener todos los usuarios (solo admin)
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  // Actualizar perfil de usuario
  updateProfile: async (userData) => {
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  },

  // Eliminar usuario (solo admin)
  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  },
};

export default usersService;
