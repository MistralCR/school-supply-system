import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import listsService from "../../services/listsService";

function PadreDashboard() {
  const [oficialLists, setOficialLists] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Cargar listas oficiales
      const oficiales = await listsService.getOficialLists();
      setOficialLists(oficiales);

      // Cargar listas guardadas (simulado - en una implementación real vendría del backend)
      setSavedLists([]);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (list) => {
    setSelectedList(list);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedList(null);
    setShareEmail("");
  };

  const handleShare = async () => {
    if (!shareEmail) {
      toast.error("Por favor ingrese un email válido");
      return;
    }

    try {
      // Aquí iría la lógica para compartir la lista
      toast.success(`Lista compartida con ${shareEmail}`);
      handleCloseModal();
    } catch (error) {
      toast.error("Error al compartir lista");
    }
  };

  const handleDownload = async (list) => {
    try {
      // Simular descarga de PDF
      const element = document.createElement("a");
      const file = new Blob([generateListText(list)], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `lista-${list.nombre.replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success("Lista descargada correctamente");
    } catch (error) {
      toast.error("Error al descargar lista");
    }
  };

  const generateListText = (list) => {
    let text = `LISTA DE ÚTILES ESCOLARES\n`;
    text += `========================\n\n`;
    text += `Nombre: ${list.nombre}\n`;
    text += `Nivel: ${list.nivel?.nombre}\n`;
    text += `Fecha: ${new Date().toLocaleDateString("es-ES")}\n\n`;
    text += `MATERIALES:\n`;
    text += `-----------\n`;

    let total = 0;
    list.materiales?.forEach((item, index) => {
      const subtotal = item.cantidad * (item.material?.precio || 0);
      total += subtotal;
      text += `${index + 1}. ${item.material?.nombre}\n`;
      text += `   Cantidad: ${item.cantidad}\n`;
      text += `   Precio unitario: ₡${item.material?.precio?.toLocaleString()}\n`;
      text += `   Subtotal: ₡${subtotal.toLocaleString()}\n\n`;
    });

    text += `TOTAL: ₡${total.toLocaleString()}\n`;
    return text;
  };

  const calculateTotal = (materiales) => {
    return (
      materiales?.reduce(
        (total, item) => total + item.cantidad * (item.material?.precio || 0),
        0
      ) || 0
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
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
      <div className="mb-4">
        <h1 className="h3 mb-2">Portal de Padres</h1>
        <p className="text-muted">
          Consulta y descarga las listas oficiales de útiles escolares
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-list-check fs-1"></i>
              </div>
              <h3 className="mb-1">{oficialLists.length}</h3>
              <p className="text-muted mb-0">Listas Oficiales</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-bookmark-heart fs-1"></i>
              </div>
              <h3 className="mb-1">{savedLists.length}</h3>
              <p className="text-muted mb-0">Listas Guardadas</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-share fs-1"></i>
              </div>
              <h3 className="mb-1">0</h3>
              <p className="text-muted mb-0">Listas Compartidas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Listas oficiales */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom-0 py-3">
          <h5 className="mb-0">
            <i className="bi bi-star-fill text-warning me-2"></i>
            Listas Oficiales de Útiles
          </h5>
        </Card.Header>
        <Card.Body>
          {oficialLists.length > 0 ? (
            <Row>
              {oficialLists.map((list) => (
                <Col lg={6} className="mb-4" key={list._id}>
                  <Card className="h-100 border">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="card-title mb-1">{list.nombre}</h6>
                          <Badge bg="info" className="mb-2">
                            {list.nivel?.nombre}
                          </Badge>
                        </div>
                        <Badge bg="success">Oficial</Badge>
                      </div>

                      {list.descripcion && (
                        <p className="text-muted small mb-3">
                          {list.descripcion}
                        </p>
                      )}

                      <div className="mb-3">
                        <div className="d-flex justify-content-between text-sm">
                          <span>Materiales:</span>
                          <Badge bg="primary" pill>
                            {list.materiales?.length || 0}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between text-sm">
                          <span>Total estimado:</span>
                          <strong>
                            ₡{calculateTotal(list.materiales).toLocaleString()}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between text-sm text-muted">
                          <span>Publicada:</span>
                          <span>{formatDate(list.createdAt)}</span>
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(list)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Ver Detalles
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            className="flex-grow-1"
                            onClick={() => handleDownload(list)}
                          >
                            <i className="bi bi-download me-2"></i>
                            Descargar
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleShowModal(list)}
                          >
                            <i className="bi bi-share"></i>
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <i
                className="bi bi-list-ul text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
              <h4 className="mt-3 text-muted">
                No hay listas oficiales disponibles
              </h4>
              <p className="text-muted">
                Las listas oficiales aparecerán aquí cuando los profesores las
                publiquen
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para ver detalles y compartir */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedList?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedList && (
            <div>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Nivel:</strong> {selectedList.nivel?.nombre}
                </Col>
                <Col sm={6}>
                  <strong>Estado:</strong> <Badge bg="success">Oficial</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Creado por:</strong> {selectedList.createdBy?.nombre}
                </Col>
                <Col sm={6}>
                  <strong>Fecha:</strong> {formatDate(selectedList.createdAt)}
                </Col>
              </Row>
              {selectedList.descripcion && (
                <Row className="mb-3">
                  <Col>
                    <strong>Descripción:</strong> {selectedList.descripcion}
                  </Col>
                </Row>
              )}

              <h5 className="mt-4 mb-3">Lista de Materiales</h5>
              {selectedList.materiales && selectedList.materiales.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedList.materiales.map((item, index) => (
                      <tr key={index}>
                        <td>{item.material?.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>₡{item.material?.precio?.toLocaleString()}</td>
                        <td>
                          ₡
                          {(
                            item.cantidad * (item.material?.precio || 0)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Total:</strong>
                      </td>
                      <td>
                        <strong>
                          ₡
                          {calculateTotal(
                            selectedList.materiales
                          ).toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              ) : (
                <p className="text-muted">No hay materiales en esta lista.</p>
              )}

              <hr className="my-4" />

              <h6 className="mb-3">Compartir Lista</h6>
              <Form.Group className="mb-3">
                <Form.Label>Email del destinatario</Form.Label>
                <Form.Control
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="ejemplo@email.com"
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button
            variant="success"
            onClick={() => handleDownload(selectedList)}
          >
            <i className="bi bi-download me-2"></i>
            Descargar
          </Button>
          <Button variant="primary" onClick={handleShare}>
            <i className="bi bi-share me-2"></i>
            Compartir
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default PadreDashboard;
