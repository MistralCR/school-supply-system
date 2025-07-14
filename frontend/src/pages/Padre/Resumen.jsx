import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, Table } from "react-bootstrap";
import Layout from "../../components/Layout";

function PadreResumen() {
  const [resumen, setResumen] = useState({
    listasGuardadas: 0,
    totalEstimado: 0,
    materialesUnicos: 0,
    ultimaActividad: null,
  });

  useEffect(() => {
    // Simular datos de resumen
    setResumen({
      listasGuardadas: 3,
      totalEstimado: 45500,
      materialesUnicos: 12,
      ultimaActividad: new Date().toISOString(),
    });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="h3 mb-2">Resumen de Compras</h1>
        <p className="text-muted">
          Resumen de todas las listas de útiles guardadas
        </p>
      </div>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-bookmark-heart fs-1"></i>
              </div>
              <h3 className="mb-1">{resumen.listasGuardadas}</h3>
              <p className="text-muted mb-0">Listas Guardadas</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-currency-dollar fs-1"></i>
              </div>
              <h3 className="mb-1">
                ₡{resumen.totalEstimado.toLocaleString()}
              </h3>
              <p className="text-muted mb-0">Total Estimado</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-box-seam fs-1"></i>
              </div>
              <h3 className="mb-1">{resumen.materialesUnicos}</h3>
              <p className="text-muted mb-0">Materiales Únicos</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-clock fs-1"></i>
              </div>
              <h6 className="mb-1">{formatDate(resumen.ultimaActividad)}</h6>
              <p className="text-muted mb-0">Última Actividad</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Resumen consolidado */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom-0 py-3">
          <h5 className="mb-0">
            <i className="bi bi-list-check me-2"></i>
            Resumen Consolidado de Compras
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-5">
            <i
              className="bi bi-graph-up text-muted"
              style={{ fontSize: "4rem" }}
            ></i>
            <h4 className="mt-3 text-muted">Resumen en desarrollo</h4>
            <p className="text-muted">
              Esta funcionalidad estará disponible cuando tengas listas
              guardadas
            </p>
            <Badge bg="info" className="px-3 py-2">
              Próximamente
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
}

export default PadreResumen;
