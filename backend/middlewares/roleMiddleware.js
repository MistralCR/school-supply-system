// Middleware para verificar rol de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.rol === "admin") {
    next();
  } else {
    res.status(401).json({ message: "No autorizado como administrador" });
  }
};

// Middleware para verificar rol de profesor
const profesor = (req, res, next) => {
  if (req.user && (req.user.rol === "profesor" || req.user.rol === "admin")) {
    next();
  } else {
    res.status(401).json({ message: "No autorizado como profesor" });
  }
};

// Middleware para verificar múltiples roles
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.rol)) {
      next();
    } else {
      res.status(401).json({
        message: `No autorizado. Se requiere uno de los siguientes roles: ${roles.join(
          ", "
        )}`,
      });
    }
  };
};

module.exports = {
  admin,
  profesor,
  checkRole,
};
