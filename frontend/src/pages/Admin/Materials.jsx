import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import materialsService from "../../services/materialsService";

function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    nivel: "",
    imagen: "",
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await materialsService.getMaterials();
      setMaterials(data);
    } catch (error) {
      toast.error("Error al cargar materiales");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (material = null) => {
    if (material) {
      setSelectedMaterial(material);
      setFormData({
        nombre: material.nombre,
        descripcion: material.descripcion || "",
        precio: material.precio,
        categoria: material.categoria?._id || "",
        nivel: material.nivel?._id || "",
        imagen: material.imagen || "",
      });
    } else {
      setSelectedMaterial(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        nivel: "",
        imagen: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaterial(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMaterial) {
        await materialsService.updateMaterial(selectedMaterial._id, formData);
        toast.success("Material actualizado correctamente");
      } else {
        await materialsService.createMaterial(formData);
        toast.success("Material creado correctamente");
      }
      handleCloseModal();
      loadMaterials();
    } catch (error) {
      toast.error("Error al guardar material");
    }
  };

  const handleDelete = async (materialId) => {
    if (window.confirm("¿Está seguro de eliminar este material?")) {
      try {
        await materialsService.deleteMaterial(materialId);
        toast.success("Material eliminado correctamente");
        loadMaterials();
      } catch (error) {
        toast.error("Error al eliminar material");
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Gestión de Materiales</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Material
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material._id}>
                  <td>{material.nombre}</td>
                  <td>{material.descripcion || "Sin descripción"}</td>
                  <td>₡{material.precio?.toLocaleString()}</td>
                  <td>{material.categoria?.nombre || "Sin categoría"}</td>
                  <td>{material.nivel?.nombre || "Sin nivel"}</td>
                  <td>
                    <Badge bg={material.disponible ? "success" : "danger"}>
                      {material.disponible ? "Disponible" : "No disponible"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(material)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(material._id)}
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

      {/* Modal para crear/editar material */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMaterial ? "Editar Material" : "Nuevo Material"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio (₡)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría (ID)</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="ID de la categoría"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nivel (ID)</Form.Label>
              <Form.Control
                type="text"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                placeholder="ID del nivel educativo"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {selectedMaterial ? "Actualizar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
}

export default AdminMaterials;
