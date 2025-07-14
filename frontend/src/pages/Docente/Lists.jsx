import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import listsService from "../../services/listsService";
import materialsService from "../../services/materialsService";

function DocenteListas() {
  const [lists, setLists] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    nivel: "",
    materiales: [],
  });
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listsData, materialsData] = await Promise.all([
        listsService.getMyLists(),
        materialsService.getMaterials(),
      ]);
      setLists(listsData);
      setMaterials(materialsData);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (list = null) => {
    if (list) {
      setSelectedList(list);
      setFormData({
        nombre: list.nombre,
        descripcion: list.descripcion || "",
        nivel: list.nivel?._id || "",
        materiales: list.materiales || [],
      });
      setSelectedMaterials(
        list.materiales?.map((item) => ({
          material: item.material._id,
          cantidad: item.cantidad,
        })) || []
      );
    } else {
      setSelectedList(null);
      setFormData({
        nombre: "",
        descripcion: "",
        nivel: "",
        materiales: [],
      });
      setSelectedMaterials([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedList(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMaterial = () => {
    setSelectedMaterials([...selectedMaterials, { material: "", cantidad: 1 }]);
  };

  const handleRemoveMaterial = (index) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...selectedMaterials];
    updatedMaterials[index][field] = value;
    setSelectedMaterials(updatedMaterials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listData = {
        ...formData,
        materiales: selectedMaterials.filter(
          (item) => item.material && item.cantidad > 0
        ),
      };

      if (selectedList) {
        await listsService.updateList(selectedList._id, listData);
        toast.success("Lista actualizada correctamente");
      } else {
        await listsService.createList(listData);
        toast.success("Lista creada correctamente");
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      toast.error("Error al guardar lista");
    }
  };

  const handleDelete = async (listId) => {
    if (window.confirm("¿Está seguro de eliminar esta lista?")) {
      try {
        await listsService.deleteList(listId);
        toast.success("Lista eliminada correctamente");
        loadData();
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
      loadData();
    } catch (error) {
      toast.error("Error al actualizar lista");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotal = (materiales) => {
    return (
      materiales?.reduce(
        (total, item) => total + item.cantidad * (item.material?.precio || 0),
        0
      ) || 0
    );
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
        <h1 className="h3 mb-0">Mis Listas de Útiles</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Lista
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {lists.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Materiales</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lists.map((list) => (
                  <tr key={list._id}>
                    <td>
                      <div className="fw-bold">{list.nombre}</div>
                      {list.descripcion && (
                        <small className="text-muted">{list.descripcion}</small>
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
                    <td>
                      <strong>
                        ₡{calculateTotal(list.materiales).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(list)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant={list.oficial ? "warning" : "success"}
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          handleToggleOficial(list._id, list.oficial)
                        }
                        title={
                          list.oficial
                            ? "Desmarcar como oficial"
                            : "Marcar como oficial"
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
                        onClick={() => handleDelete(list._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <i
                className="bi bi-list-ul text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
              <h4 className="mt-3 text-muted">No has creado listas aún</h4>
              <p className="text-muted">
                Crea tu primera lista de útiles escolares
              </p>
              <Button variant="primary" onClick={() => handleShowModal()}>
                Crear Lista
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para crear/editar lista */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedList ? "Editar Lista" : "Nueva Lista"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Lista</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Lista 1er Grado 2024"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel Educativo (ID)</Form.Label>
                  <Form.Control
                    type="text"
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    required
                    placeholder="ID del nivel educativo"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción opcional de la lista"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Materiales</h5>
              <Button variant="outline-primary" onClick={handleAddMaterial}>
                <i className="bi bi-plus-lg me-2"></i>
                Agregar Material
              </Button>
            </div>

            {selectedMaterials.map((item, index) => (
              <Row key={index} className="mb-3 align-items-end">
                <Col md={6}>
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    value={item.material}
                    onChange={(e) =>
                      handleMaterialChange(index, "material", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccionar material</option>
                    {materials.map((material) => (
                      <option key={material._id} value={material._id}>
                        {material.nombre} - ₡{material.precio?.toLocaleString()}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleMaterialChange(
                        index,
                        "cantidad",
                        parseInt(e.target.value)
                      )
                    }
                    required
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveMaterial(index)}
                    className="w-100"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </Col>
              </Row>
            ))}

            {selectedMaterials.length === 0 && (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-box-seam fs-1 mb-3 d-block"></i>
                <p>No has agregado materiales a esta lista</p>
                <Button variant="outline-primary" onClick={handleAddMaterial}>
                  Agregar primer material
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {selectedList ? "Actualizar" : "Crear"} Lista
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
}

export default DocenteListas;
