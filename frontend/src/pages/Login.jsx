import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegisterModal from "../components/Auth/RegisterModal";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { login, isAuthenticated, user, loading, error, clearError } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "🔍 Login useEffect - isAuthenticated:",
      isAuthenticated,
      "user:",
      user
    );
    if (isAuthenticated && user && user.rol) {
      console.log("🚀 Usuario autenticado con datos completos, rol:", user.rol);

      // Usar timeout para asegurar que el estado se haya actualizado completamente
      setTimeout(() => {
        // Redirigir según el rol del usuario
        switch (user.rol) {
          case "admin":
            console.log("📍 Redirigiendo a admin dashboard");
            window.location.href = "/admin/dashboard";
            break;
          case "profesor":
            console.log("📍 Redirigiendo a docente dashboard");
            window.location.href = "/docente/dashboard";
            break;
          case "padre":
            console.log("📍 Redirigiendo a padre dashboard");
            window.location.href = "/padre/dashboard";
            break;
          default:
            console.log("❌ Rol no reconocido, volviendo a login");
            window.location.href = "/login";
        }
      }, 100); // Pequeño delay para asegurar que el estado esté actualizado
    } else if (isAuthenticated && !user) {
      console.log(
        "⚠️ Usuario autenticado pero sin datos de usuario, esperando..."
      );
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success("¡Bienvenido!");
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  const handleRegistrationSuccess = (email) => {
    setFormData({ ...formData, email: email, password: "" });
    toast.success("¡Cuenta creada exitosamente! Ya puedes iniciar sesión.");
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="login-card border-0 shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-book display-4 text-primary mb-3"></i>
                  <h2 className="fw-bold text-dark">Iniciar Sesión</h2>
                  <p className="text-muted">Sistema de Útiles Escolares</p>
                </div>

                {error && (
                  <Alert variant="danger" className="alert-custom">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-envelope me-2"></i>
                      Correo Electrónico
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <i className="bi bi-lock me-2"></i>
                      Contraseña
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Tu contraseña"
                        required
                        className="form-control-lg pe-5"
                      />
                      <Button
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y border-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-gradient w-100 btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <p className="text-muted mb-2">¿No tienes cuenta?</p>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => setShowRegisterModal(true)}
                      disabled={loading}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Crear Cuenta de Padre de Familia
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    ¿Problemas para acceder? Contacta al administrador
                  </small>
                </div>

                {/* Credenciales de prueba */}
                <Card className="mt-4 bg-light">
                  <Card.Body className="p-3">
                    <h6 className="text-center mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Credenciales de Prueba
                    </h6>
                    <Alert variant="info" className="small mb-3">
                      <strong>Nota:</strong> Los padres pueden crear su propia
                      cuenta usando el botón "Crear Cuenta". Los profesores son
                      creados únicamente por el administrador.
                    </Alert>
                    <Row>
                      <Col sm={4} className="mb-2">
                        <div className="text-center">
                          <Badge bg="primary" className="mb-2">
                            Administrador
                          </Badge>
                          <div className="small">
                            <div>
                              <strong>Email:</strong>
                            </div>
                            <div className="text-break">admin@escuela.com</div>
                            <div>
                              <strong>Contraseña:</strong>
                            </div>
                            <div>admin123</div>
                          </div>
                        </div>
                      </Col>
                      <Col sm={4} className="mb-2">
                        <div className="text-center">
                          <Badge bg="success" className="mb-2">
                            Profesor
                          </Badge>
                          <div className="small">
                            <div>
                              <strong>Email:</strong>
                            </div>
                            <div className="text-break">
                              profesor@escuela.com
                            </div>
                            <div>
                              <strong>Contraseña:</strong>
                            </div>
                            <div>profesor123</div>
                          </div>
                        </div>
                      </Col>
                      <Col sm={4} className="mb-2">
                        <div className="text-center">
                          <Badge bg="warning" className="mb-2">
                            Padre
                          </Badge>
                          <div className="small">
                            <div>
                              <strong>Email:</strong>
                            </div>
                            <div className="text-break">padre@familia.com</div>
                            <div>
                              <strong>Contraseña:</strong>
                            </div>
                            <div>padre123</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de Registro */}
      <RegisterModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}

export default Login;
