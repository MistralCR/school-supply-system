import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import listsService from "../../services/listsService";

function AdminLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const data = await listsService.getLists();
      setLists(data);
    } catch (error) {
      toast.error("Error al cargar listas");
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
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm("¿Está seguro de eliminar esta lista?")) {
      try {
        await listsService.deleteList(listId);
        toast.success("Lista eliminada correctamente");
        loadLists();
      } catch (error) {
        toast.error("Error al eliminar lista");
      }
    }
  };

  const handleToggleOficial = async (listId, isOficial) => {
    try {
      await listsService.updateList(listId, { oficial: !isOficial });
      toast.success(
        `Lista ${!isOficial ? "marcada" : "desmarcada"} como oficial`
      );
      loadLists();
    } catch (error) {
      toast.error("Error al actualizar lista");
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Gestión de Listas</h1>
        <div className="d-flex gap-2">
          <Badge bg="primary" className="px-3 py-2">
            Total: {lists.length}
          </Badge>
          <Badge bg="success" className="px-3 py-2">
            Oficiales: {lists.filter((list) => list.oficial).length}
          </Badge>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nivel</th>
                <th>Creado por</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Materiales</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => (
                <tr key={list._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="fw-bold">{list.nombre}</div>
                        {list.descripcion && (
                          <small className="text-muted">
                            {list.descripcion}
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{list.nivel?.nombre}</Badge>
                  </td>
                  <td>{list.createdBy?.nombre}</td>
                  <td>{formatDate(list.createdAt)}</td>
                  <td>
                    <Badge bg={list.oficial ? "success" : "secondary"}>
                      {list.oficial ? "Oficial" : "Personal"}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="primary" pill>
                      {list.materiales?.length || 0}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(list)}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button
                      variant={list.oficial ? "warning" : "success"}
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        handleToggleOficial(list._id, list.oficial)
                      }
                    >
                      <i
                        className={`bi ${
                          list.oficial ? "bi-star-fill" : "bi-star"
                        }`}
                      ></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteList(list._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para ver detalles de lista */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalles de la Lista: {selectedList?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedList && (
            <div>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Nivel:</strong> {selectedList.nivel?.nombre}
                </Col>
                <Col sm={6}>
                  <strong>Estado:</strong>{" "}
                  <Badge bg={selectedList.oficial ? "success" : "secondary"}>
                    {selectedList.oficial ? "Oficial" : "Personal"}
                  </Badge>
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

              <h5 className="mt-4 mb-3">Materiales en la Lista</h5>
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
                        <td>
                          {item.material?.nombre || "Material no encontrado"}
                        </td>
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
                          {selectedList.materiales
                            .reduce(
                              (total, item) =>
                                total +
                                item.cantidad * (item.material?.precio || 0),
                              0
                            )
                            .toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              ) : (
                <p className="text-muted">No hay materiales en esta lista.</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default AdminLists;
