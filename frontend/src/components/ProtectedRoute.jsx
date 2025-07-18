import React from "react";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  console.log(
    "🛡️ ProtectedRoute - loading:",
    loading,
    "isAuthenticated:",
    isAuthenticated,
    "user:",
    user,
    "allowedRoles:",
    allowedRoles
  );

  if (loading) {
    console.log("⏳ ProtectedRoute: Mostrando loading...");
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border spinner-custom" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "❌ ProtectedRoute: Usuario no autenticado, redirigiendo a login"
    );
    window.location.href = "/login";
    return null;
  }

  console.log(
    "✅ ProtectedRoute: Usuario autenticado, verificando permisos..."
  );
  console.log("  - allowedRoles.length:", allowedRoles.length);
  console.log("  - user?.rol:", user?.rol);
  console.log("  - allowedRoles:", allowedRoles);

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    console.log(
      "🚫 ProtectedRoute: Acceso denegado para rol:",
      user?.rol,
      "roles permitidos:",
      allowedRoles
    );

    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Acceso Denegado</h4>
          <p>No tienes permisos para acceder a esta página.</p>
          <hr />
          <p className="mb-0">
            <small>
              Tu rol: <code>{user?.rol}</code>
            </small>
            <br />
            <small>
              Roles permitidos: <code>{allowedRoles.join(", ")}</code>
            </small>
          </p>
        </div>
      </div>
    );
  }

  console.log("✅ ProtectedRoute: Acceso permitido, renderizando componente");
  return children;
}

export default ProtectedRoute;
