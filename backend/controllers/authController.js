const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { nombre, email, password, telefono, rol, direccion, cedula } =
    req.body;

  try {
    // Verifica si el campo es obligatorio
    if (!nombre || !email || !password || !cedula) {
      return res.status(400).json({
        message: "Nombre, email, contraseña y cédula son obligatorios",
      });
    }

    // Verifica si el usuario ya existe por email
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Verifica si la cédula ya existe
    const cedulaExists = await User.findOne({ cedula });
    if (cedulaExists) {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }

    // Solo permitir registro directo para padres
    const userRole = rol === "padre" ? "padre" : "padre"; // Por defecto padre

    // Crear nuevo usuario
    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      cedula,
      direccion,
      rol: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        cedula: user.cedula,
        direccion: user.direccion,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica si el usuario existe
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        cedula: user.cedula,
        direccion: user.direccion,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email o contraseña incorrectos" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Cerrar sesión
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.json({ message: "Sesión cerrada correctamente" });
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  logoutUser,
};
