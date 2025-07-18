import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Table, Badge, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import listsService from "../../services/listsService";
import materialsService from "../../services/materialsService";

function DocenteDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalListas: 0,
    listasOficiales: 0,
    materialesCreados: 0,
    nivelesAtendidos: 0,
  });
  const [recentLists, setRecentLists] = useState([]);
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
      // Cargar listas del profesor
      const lists = await listsService.getMyLists();

      // Cargar materiales creados
      const materials = await materialsService.getMaterials();

      setStats({
        totalListas: lists.length,
        listasOficiales: lists.filter((list) => list.oficial).length,
        materialesCreados: materials.length,
        nivelesAtendidos: [...new Set(lists.map((list) => list.nivel?._id))]
          .length,
      });

      // Tomar las 5 listas más recientes
      setRecentLists(lists.slice(0, 5));
    } catch (error) {
      toast.error("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <h1 className="h3 mb-2 mb-md-0">Dashboard del Profesor</h1>
        <div className="d-flex gap-2 flex-wrap">
          <Button variant="primary" href="/docente/listas">
            <i className="bi bi-plus-lg me-2"></i>
            <span className="d-none d-sm-inline">Nueva Lista</span>
            <span className="d-inline d-sm-none">Nueva</span>
          </Button>
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
      </div>

      {/* Cards de estadísticas */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-list-ul fs-1"></i>
              </div>
              <h3 className="mb-1">{stats.totalListas}</h3>
              <p className="text-muted mb-0">Listas Creadas</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-star-fill fs-1"></i>
              </div>
              <h3 className="mb-1">{stats.listasOficiales}</h3>
              <p className="text-muted mb-0">Listas Oficiales</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-box-seam fs-1"></i>
              </div>
              <h3 className="mb-1">{stats.materialesCreados}</h3>
              <p className="text-muted mb-0">Materiales Disponibles</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-layers fs-1"></i>
              </div>
              <h3 className="mb-1">{stats.nivelesAtendidos}</h3>
              <p className="text-muted mb-0">Niveles Atendidos</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Listas recientes */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Listas Recientes</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  href="/docente/listas"
                >
                  Ver todas
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentLists.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Nivel</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Materiales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLists.map((list) => (
                      <tr key={list._id}>
                        <td>
                          <div className="fw-bold">{list.nombre}</div>
                          {list.descripcion && (
                            <small className="text-muted">
                              {list.descripcion}
                            </small>
                          )}
                        </td>
                        <td>
                          <Badge bg="info">{list.nivel?.nombre}</Badge>
                        </td>
                        <td>
                          <Badge bg={list.oficial ? "success" : "secondary"}>
                            {list.oficial ? "Oficial" : "Personal"}
                          </Badge>
                        </td>
                        <td>{formatDate(list.createdAt)}</td>
                        <td>
                          <Badge bg="primary" pill>
                            {list.materiales?.length || 0}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-list-ul fs-1 mb-3 d-block"></i>
                  <p>No has creado listas aún</p>
                  <Button variant="primary" href="/docente/listas">
                    Crear primera lista
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Acciones rápidas */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom-0 py-3">
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <Button
                  variant="outline-primary"
                  href="/docente/listas"
                  className="text-start"
                >
                  <i className="bi bi-plus-circle me-3"></i>
                  Crear Nueva Lista
                </Button>
                <Button
                  variant="outline-success"
                  href="/docente/listas"
                  className="text-start"
                >
                  <i className="bi bi-list-check me-3"></i>
                  Gestionar Listas
                </Button>
                <Button
                  variant="outline-info"
                  href="/admin/materials"
                  className="text-start"
                >
                  <i className="bi bi-box-seam me-3"></i>
                  Ver Materiales
                </Button>
                <Button
                  variant="outline-warning"
                  href="#"
                  className="text-start"
                >
                  <i className="bi bi-graph-up me-3"></i>
                  Estadísticas Detalladas
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Tips para profesores */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Header className="bg-primary text-white py-3">
              <h6 className="mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                Tips para Profesores
              </h6>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Marca tus listas como oficiales para que sean visibles a todos
                  los padres
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Revisa regularmente los precios de los materiales
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Agrupa materiales por categorías para mejor organización
                </li>
              </ul>
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

export default DocenteDashboard;
