import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Table,
  Badge,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import padreService from "../../services/padreService";

function ResumenComprasModal({ show, onHide }) {
  const { user } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      loadResumen();
    }
  }, [show]);

  const loadResumen = async () => {
    try {
      setLoading(true);
      const data = await padreService.getResumenComprasSimulado();
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cargando...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (!resumen) {
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">Error al cargar el resumen de compras.</Alert>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-receipt me-2"></i>
          Resumen de Compras - {user?.nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Estadísticas generales */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary">
                  ₡{resumen.totalGastado.toLocaleString()}
                </h3>
                <p className="mb-0">Total Gastado</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">
                  ₡{resumen.totalPendiente.toLocaleString()}
                </h3>
                <p className="mb-0">Total Pendiente</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">{resumen.itemsComprados}</h3>
                <p className="mb-0">Útiles Comprados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info">{resumen.itemsPendientes}</h3>
                <p className="mb-0">Útiles Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Progreso por lista */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">Progreso por Lista</h6>
          </Card.Header>
          <Card.Body>
            {resumen.progresoListas.map((lista, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span>
                    <strong>{lista.titulo}</strong>
                  </span>
                  <Badge bg={lista.progreso === 100 ? "success" : "primary"}>
                    {lista.progreso}%
                  </Badge>
                </div>
                <div className="progress mb-1">
                  <div
                    className="progress-bar"
                    style={{ width: `${lista.progreso}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {lista.comprados} de {lista.total} útiles • Gastado: ₡
                  {lista.gastado.toLocaleString()} de ₡
                  {lista.totalPrecio.toLocaleString()}
                </small>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Historial de compras recientes */}
        <Card>
          <Card.Header>
            <h6 className="mb-0">Compras Recientes</h6>
          </Card.Header>
          <Card.Body>
            {resumen.historialCompras.length > 0 ? (
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Útil</th>
                    <th>Lista</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.historialCompras.map((compra, index) => (
                    <tr key={index}>
                      <td>{formatearFecha(compra.fecha)}</td>
                      <td>{compra.nombreUtil}</td>
                      <td>{compra.lista}</td>
                      <td>{compra.cantidad}</td>
                      <td>₡{compra.precio.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                No hay compras registradas aún.
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          <i className="bi bi-printer me-2"></i>
          Imprimir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResumenComprasModal;
