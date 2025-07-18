import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import usersService from "../../services/usersService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "padre",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono || "",
        rol: user.rol,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        rol: "padre",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
      if (selectedUser) {
        // Actualizar usuario
        await usersService.updateProfile(formData);
        toast.success("Usuario actualizado correctamente");
      } else {
        // Crear nuevo usuario - esto requeriría endpoint adicional
        toast.info("Funcionalidad de crear usuario pendiente de implementar");
      }
      handleCloseModal();
      loadUsers();
    } catch (error) {
      toast.error("Error al guardar usuario");
    }
  };

  const handleDelete = async (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await usersService.deleteUser(userToDelete);
        toast.success("Usuario eliminado correctamente");
        loadUsers();
      } catch (error) {
        toast.error("Error al eliminar usuario");
      } finally {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Gestión de Usuarios</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Usuario
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono || "No especificado"}</td>
                  <td>{getRoleBadge(user.rol)}</td>
                  <td>
                    <Badge bg={user.activo ? "success" : "danger"}>
                      {user.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td>{new Date(user.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(user)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
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

      {/* Modal para crear/editar usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="padre">Padre de Familia</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {selectedUser ? "Actualizar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
            <h5>¿Estás seguro de eliminar este usuario?</h5>
            <p className="text-muted mb-0">Esta acción no se puede deshacer.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <i className="bi bi-trash me-2"></i>
            Eliminar Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default AdminUsers;
