import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import listsService from "../../services/listsService";

function PadreListas() {
  const [oficialLists, setOficialLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    nivel: "",
  });

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [oficialLists, filters]);

  const loadLists = async () => {
    try {
      const data = await listsService.getOficialLists();
      setOficialLists(data);
    } catch (error) {
      toast.error("Error al cargar listas");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...oficialLists];

    // Filtrar por búsqueda
    if (filters.search) {
      filtered = filtered.filter(
        (list) =>
          list.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
          list.descripcion?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtrar por nivel
    if (filters.nivel) {
      filtered = filtered.filter((list) => list.nivel?._id === filters.nivel);
    }

    setFilteredLists(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      // Aquí iría la llamada al backend para compartir
      toast.success(`Lista compartida con ${shareEmail}`);
      handleCloseModal();
    } catch (error) {
      toast.error("Error al compartir lista");
    }
  };

  const handleDownload = async (list) => {
    try {
      // Generar y descargar archivo de texto
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
    text += `Profesor: ${list.createdBy?.nombre}\n`;
    text += `Fecha: ${new Date().toLocaleDateString("es-ES")}\n\n`;

    if (list.descripcion) {
      text += `Descripción: ${list.descripcion}\n\n`;
    }

    text += `MATERIALES REQUERIDOS:\n`;
    text += `---------------------\n`;

    let total = 0;
    list.materiales?.forEach((item, index) => {
      const subtotal = item.cantidad * (item.material?.precio || 0);
      total += subtotal;
      text += `${index + 1}. ${item.material?.nombre}\n`;
      text += `   Cantidad requerida: ${item.cantidad}\n`;
      text += `   Precio estimado: ₡${item.material?.precio?.toLocaleString()}\n`;
      text += `   Subtotal: ₡${subtotal.toLocaleString()}\n\n`;
    });

    text += `TOTAL ESTIMADO: ₡${total.toLocaleString()}\n\n`;
    text += `* Los precios son estimados y pueden variar según el proveedor.\n`;
    text += `* Esta lista fue generada desde el Sistema de Gestión de Útiles Escolares.`;

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

  // Obtener niveles únicos para el filtro
  const uniqueNiveles = [
    ...new Set(oficialLists.map((list) => list.nivel?._id)),
  ].filter(Boolean);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-2">Listas de Útiles Oficiales</h1>
          <p className="text-muted mb-0">
            Consulta, descarga y comparte las listas oficiales
          </p>
        </div>
        <Badge bg="primary" className="px-3 py-2">
          {filteredLists.length} lista{filteredLists.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Buscar listas</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filtrar por nivel</Form.Label>
                <Form.Select
                  value={filters.nivel}
                  onChange={(e) => handleFilterChange("nivel", e.target.value)}
                >
                  <option value="">Todos los niveles</option>
                  {uniqueNiveles.map((nivelId) => {
                    const nivel = oficialLists.find(
                      (list) => list.nivel?._id === nivelId
                    )?.nivel;
                    return (
                      <option key={nivelId} value={nivelId}>
                        {nivel?.nombre}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Lista de listas oficiales */}
      {filteredLists.length > 0 ? (
        <Row>
          {filteredLists.map((list) => (
            <Col lg={6} xl={4} className="mb-4" key={list._id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h6 className="card-title mb-1">{list.nombre}</h6>
                      <Badge bg="info" className="mb-2">
                        {list.nivel?.nombre}
                      </Badge>
                    </div>
                    <Badge bg="success" className="ms-2">
                      <i className="bi bi-star-fill me-1"></i>
                      Oficial
                    </Badge>
                  </div>

                  {list.descripcion && (
                    <p className="text-muted small mb-3 flex-grow-1">
                      {list.descripcion.length > 100
                        ? `${list.descripcion.substring(0, 100)}...`
                        : list.descripcion}
                    </p>
                  )}

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Materiales:</span>
                      <Badge bg="primary" pill>
                        {list.materiales?.length || 0}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Total estimado:</span>
                      <strong className="text-success">
                        ₡{calculateTotal(list.materiales).toLocaleString()}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Publicada:</span>
                      <span className="small">
                        {formatDate(list.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
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
                          title="Compartir lista"
                        >
                          <i className="bi bi-share"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <i
              className="bi bi-search text-muted"
              style={{ fontSize: "4rem" }}
            ></i>
            <h4 className="mt-3 text-muted">
              {filters.search || filters.nivel
                ? "No se encontraron listas con los filtros aplicados"
                : "No hay listas oficiales disponibles"}
            </h4>
            <p className="text-muted">
              {filters.search || filters.nivel
                ? "Intenta cambiar los criterios de búsqueda"
                : "Las listas oficiales aparecerán aquí cuando los profesores las publiquen"}
            </p>
            {(filters.search || filters.nivel) && (
              <Button
                variant="outline-primary"
                onClick={() => setFilters({ search: "", nivel: "" })}
              >
                Limpiar filtros
              </Button>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Modal para ver detalles y compartir */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-list-check me-2"></i>
            {selectedList?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedList && (
            <div>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Nivel Educativo:</strong> {selectedList.nivel?.nombre}
                </Col>
                <Col sm={6}>
                  <strong>Estado:</strong>{" "}
                  <Badge bg="success">
                    <i className="bi bi-star-fill me-1"></i>
                    Oficial
                  </Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Profesor:</strong> {selectedList.createdBy?.nombre}
                </Col>
                <Col sm={6}>
                  <strong>Fecha de publicación:</strong>{" "}
                  {formatDate(selectedList.createdAt)}
                </Col>
              </Row>
              {selectedList.descripcion && (
                <Row className="mb-3">
                  <Col>
                    <strong>Descripción:</strong>
                    <p className="mt-2 mb-0">{selectedList.descripcion}</p>
                  </Col>
                </Row>
              )}

              <hr />

              <h6 className="mb-3">
                <i className="bi bi-box-seam me-2"></i>
                Lista de Materiales Requeridos
              </h6>
              {selectedList.materiales && selectedList.materiales.length > 0 ? (
                <Table striped bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Material</th>
                      <th>Cantidad</th>
                      <th>Precio Est.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedList.materiales.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="fw-bold">{item.material?.nombre}</div>
                          {item.material?.descripcion && (
                            <small className="text-muted">
                              {item.material.descripcion}
                            </small>
                          )}
                        </td>
                        <td className="text-center">{item.cantidad}</td>
                        <td>₡{item.material?.precio?.toLocaleString()}</td>
                        <td className="fw-bold">
                          ₡
                          {(
                            item.cantidad * (item.material?.precio || 0)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-success">
                      <td colSpan="4" className="text-end fw-bold">
                        TOTAL ESTIMADO:
                      </td>
                      <td className="fw-bold text-success">
                        ₡
                        {calculateTotal(
                          selectedList.materiales
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              ) : (
                <div className="text-center text-muted py-3">
                  <i className="bi bi-box-seam fs-1 mb-2 d-block"></i>
                  <p>No hay materiales en esta lista.</p>
                </div>
              )}

              <hr />

              <h6 className="mb-3">
                <i className="bi bi-share me-2"></i>
                Compartir Lista
              </h6>
              <Form.Group className="mb-3">
                <Form.Label>Email del destinatario</Form.Label>
                <Form.Control
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="ejemplo@email.com"
                />
                <Form.Text className="text-muted">
                  Se enviará una copia de esta lista al email especificado
                </Form.Text>
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
            Descargar Lista
          </Button>
          <Button
            variant="primary"
            onClick={handleShare}
            disabled={!shareEmail}
          >
            <i className="bi bi-share me-2"></i>
            Compartir por Email
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default PadreListas;
