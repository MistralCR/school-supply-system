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

const authService = {
  // Login
  login: async (email, password) => {
    try {
      console.log("🔐 authService iniciando login con:", email);
      const response = await api.post("/auth/login", { email, password });
      console.log("🔐 authService respuesta completa:", response.data);

      // Los datos del usuario están directamente en response.data, no en response.data.user
      const {
        token,
        _id,
        nombre,
        email: userEmail,
        telefono,
        rol,
      } = response.data;

      // Crear objeto user con los datos
      const user = {
        id: _id,
        nombre,
        email: userEmail,
        telefono,
        rol,
      };

      console.log("🔐 authService user creado:", user);
      console.log("🔐 authService token:", token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.error("❌ authService error completo:", error);
      console.error("❌ authService error response:", error.response);
      console.error("❌ authService error data:", error.response?.data);
      throw error.response?.data?.message || "Error en el login";
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en el registro";
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
