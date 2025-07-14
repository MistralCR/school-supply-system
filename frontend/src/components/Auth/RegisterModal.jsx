import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import authService from "../../services/authService";

function RegisterModal({ show, onHide, onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    cedula: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("El formato del email no es válido");
      return false;
    }
    if (!formData.cedula.trim()) {
      setError("El número de cédula es requerido");
      return false;
    }
    if (!/^\d{9,10}$/.test(formData.cedula.trim())) {
      setError("La cédula debe tener entre 9 y 10 dígitos");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const registrationData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rol: "padre", // Los padres se registran directamente
        telefono: formData.telefono.trim(),
        cedula: formData.cedula.trim(),
        direccion: formData.direccion.trim(),
      };

      await authService.register(registrationData);

      setSuccess(true);

      // Mostrar mensaje de éxito por 2 segundos y luego cerrar
      setTimeout(() => {
        setSuccess(false);
        resetForm();
        onHide();
        if (onRegistrationSuccess) {
          onRegistrationSuccess(formData.email);
        }
      }, 2000);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setError(error || "Error al crear la cuenta. Inténtelo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      cedula: "",
      direccion: "",
    });
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus me-2"></i>
          Crear Cuenta de Padre de Familia
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && (
          <Alert variant="success">
            <i className="bi bi-check-circle me-2"></i>
            ¡Cuenta creada exitosamente! Ya puedes iniciar sesión.
          </Alert>
        )}

        {error && (
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-person me-2"></i>
              Nombre Completo
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese su nombre completo"
              required
              disabled={loading || success}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-envelope me-2"></i>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
              disabled={loading || success}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-card-text me-2"></i>
              Número de Cédula
            </Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="123456789"
              maxLength="10"
              required
              disabled={loading || success}
            />
            <Form.Text className="text-muted">
              Entre 9 y 10 dígitos, solo números - Campo obligatorio
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-telephone me-2"></i>
              Teléfono (Opcional)
            </Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="8888-8888"
              disabled={loading || success}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-geo-alt me-2"></i>
              Dirección (Opcional)
            </Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Dirección de residencia"
              disabled={loading || success}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-lock me-2"></i>
              Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading || success}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-lock-fill me-2"></i>
              Confirmar Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repita la contraseña"
              required
              disabled={loading || success}
            />
          </Form.Group>

          <Alert variant="info" className="small">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Nota:</strong> Esta cuenta será para padre/madre de familia.
            El número de cédula es obligatorio para identificación única. Los
            profesores son creados únicamente por el administrador del sistema.
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Creando cuenta...
            </>
          ) : (
            <>
              <i className="bi bi-person-check me-2"></i>
              Crear Cuenta
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RegisterModal;
