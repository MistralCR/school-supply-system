import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext-simple";

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuItems = () => {
    switch (user?.rol) {
      case "admin":
        return [
          {
            path: "/admin/dashboard",
            icon: "bi-speedometer2",
            label: "Dashboard",
          },
          { path: "/admin/users", icon: "bi-people", label: "Usuarios" },
          { path: "/admin/materials", icon: "bi-box", label: "Materiales" },
        ];
      case "profesor":
        return [
          {
            path: "/docente/dashboard",
            icon: "bi-speedometer2",
            label: "Dashboard",
          },
          { path: "/docente/listas", icon: "bi-list-ul", label: "Mis Listas" },
          { path: "/docente/materials", icon: "bi-box", label: "Materiales" },
        ];
      case "padre":
        return [
          {
            path: "/padre/dashboard",
            icon: "bi-speedometer2",
            label: "Dashboard",
          },
          {
            path: "/padre/listas",
            icon: "bi-list-ul",
            label: "Listas de Útiles",
          },
          {
            path: "/padre/resumen",
            icon: "bi-graph-up",
            label: "Resumen de Compras",
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar col-md-3 col-lg-2 px-0">
      <div className="p-3">
        <h6 className="text-white-50 text-uppercase small mb-3">
          {user?.rol === "admin"
            ? "Administración"
            : user?.rol === "profesor"
            ? "Profesor"
            : "Padre de Familia"}
        </h6>

        <Nav className="flex-column">
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
