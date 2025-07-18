import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Badge, Button, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import usersService from "../../services/usersService";
import listasService from "../../services/listasService";
import materialsService from "../../services/materialsService";

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfesores: 0,
    totalPadres: 0,
    totalListas: 0,
    totalMateriales: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [users, listas, materiales] = await Promise.all([
        usersService.getUsers(),
        listasService.getListas(),
        materialsService.getMaterials(),
      ]);

      const profesores = users.filter((user) => user.rol === "profesor");
      const padres = users.filter((user) => user.rol === "padre");

      setStats({
        totalUsers: users.length,
        totalProfesores: profesores.length,
        totalPadres: padres.length,
        totalListas: listas.length,
        totalMateriales: materiales.length,
      });

      // Últimos 5 usuarios registrados
      setRecentUsers(users.slice(-5).reverse());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (rol) => {
    switch (rol) {
      case "admin":
        return <Badge bg="danger">Administrador</Badge>;
      case "profesor":
        return <Badge bg="primary">Profesor</Badge>;
      case "padre":
        return <Badge bg="success">Padre</Badge>;
      default:
        return <Badge bg="secondary">{rol}</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center">
          <div className="spinner-border spinner-custom" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <h1 className="h3 mb-0 me-3">Dashboard Administrativo</h1>
          <Badge bg="info" className="fs-6">
            Administrador
          </Badge>
        </div>
        <Button
          variant="outline-danger"
          onClick={handleLogout}
          className="d-flex align-items-center"
          size="sm"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          <span className="d-none d-sm-inline">Cerrar Sesión</span>
          <span className="d-inline d-sm-none">Salir</span>
        </Button>
      </div>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="card-hover border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-people display-4 text-primary mb-2"></i>
              <h3 className="fw-bold">{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Total Usuarios</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="card-hover border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-person-badge display-4 text-info mb-2"></i>
              <h3 className="fw-bold">{stats.totalProfesores}</h3>
              <p className="text-muted mb-0">Profesores</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="card-hover border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-person-hearts display-4 text-success mb-2"></i>
              <h3 className="fw-bold">{stats.totalPadres}</h3>
              <p className="text-muted mb-0">Padres de Familia</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="card-hover border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-list-ul display-4 text-warning mb-2"></i>
              <h3 className="fw-bold">{stats.totalListas}</h3>
              <p className="text-muted mb-0">Listas de Útiles</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Usuarios Recientes
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.rol)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Estadísticas del Sistema
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Materiales Catalogados</span>
                  <strong>{stats.totalMateriales}</strong>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${Math.min(
                        (stats.totalMateriales / 100) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Listas Creadas</span>
                  <strong>{stats.totalListas}</strong>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${Math.min(
                        (stats.totalListas / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-0">
                <div className="d-flex justify-content-between mb-1">
                  <span>Usuarios Activos</span>
                  <strong>{stats.totalUsers}</strong>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    style={{
                      width: `${Math.min(
                        (stats.totalUsers / 200) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmación de logout */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cierre de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-question-circle text-warning fs-1 mb-3"></i>
            <p className="mb-0">¿Estás seguro que deseas cerrar sesión?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default AdminDashboard;
