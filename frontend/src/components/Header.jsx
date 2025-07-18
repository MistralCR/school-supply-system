import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    switch (user?.rol) {
      case "admin":
        return "/admin/dashboard";
      case "profesor":
        return "/docente/dashboard";
      case "padre":
        return "/padre/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href={getDashboardRoute()} className="fw-bold">
          <i className="bi bi-book me-2"></i>
          Sistema de Útiles Escolares
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown
              title={
                <>
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.nombre}
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item>
                <i className="bi bi-person me-2"></i>
                Perfil
              </NavDropdown.Item>
              <NavDropdown.Item>
                <i className="bi bi-gear me-2"></i>
                Configuración
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
