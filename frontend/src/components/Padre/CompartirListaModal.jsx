import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Card, ListGroup } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import padreService from "../../services/padreService";

function CompartirListaModal({ show, onHide }) {
  const { user } = useAuth();
  const [listas, setListas] = useState([]);
  const [selectedLista, setSelectedLista] = useState("");
  const [emails, setEmails] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      loadListas();
      setSelectedLista("");
      setEmails("");
      setMensaje("");
      setSuccess(false);
      setError("");
    }
  }, [show]);

  const loadListas = async () => {
    try {
      const data = await padreService.getMisListasSimulado();
      setListas(data);
    } catch (error) {
      console.error("Error al cargar listas:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLista || !emails.trim()) {
      setError("Por favor seleccione una lista e ingrese al menos un email.");
      return;
    }

    // Validar emails
    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setError(
        `Los siguientes emails no son válidos: ${invalidEmails.join(", ")}`
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const lista = listas.find((l) => l._id === selectedLista);

      // Simular envío de email
      await padreService.compartirListaSimulado({
        listaId: selectedLista,
        emails: emailList,
        mensaje: mensaje.trim(),
        remitente: user,
      });

      setSuccess(true);

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setSuccess(false);
        setSelectedLista("");
        setEmails("");
        setMensaje("");
      }, 2000);
    } catch (error) {
      console.error("Error al compartir lista:", error);
      setError("Error al compartir la lista. Inténtelo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectedListaData = listas.find((l) => l._id === selectedLista);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-share me-2"></i>
          Compartir Lista de Útiles
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && (
          <Alert variant="success">
            <i className="bi bi-check-circle me-2"></i>
            ¡Lista compartida exitosamente!
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
            <Form.Label>Seleccionar Lista</Form.Label>
            <Form.Select
              value={selectedLista}
              onChange={(e) => setSelectedLista(e.target.value)}
              required
            >
              <option value="">Seleccione una lista...</option>
              {listas.map((lista) => (
                <option key={lista._id} value={lista._id}>
                  {lista.titulo} - {lista.grado}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedListaData && (
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Vista Previa de la Lista</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{selectedListaData.titulo}</strong>
                  <span className="text-muted">{selectedListaData.grado}</span>
                </div>
                <p className="text-muted mb-2">
                  Profesor: {selectedListaData.profesor}
                </p>
                <ListGroup variant="flush">
                  {selectedListaData.materiales.slice(0, 3).map((material) => (
                    <ListGroup.Item key={material._id} className="px-0 py-1">
                      <div className="d-flex justify-content-between">
                        <span>
                          {material.nombre} (x{material.cantidad})
                        </span>
                        <span>
                          ₡
                          {(
                            material.precio * material.cantidad
                          ).toLocaleString()}
                        </span>
                      </div>
                    </ListGroup.Item>
                  ))}
                  {selectedListaData.materiales.length > 3 && (
                    <ListGroup.Item className="px-0 py-1 text-muted">
                      ... y {selectedListaData.materiales.length - 3} útiles más
                    </ListGroup.Item>
                  )}
                </ListGroup>
                <div className="mt-2">
                  <strong>
                    Total: ₡
                    {selectedListaData.materiales
                      .reduce((total, m) => total + m.precio * m.cantidad, 0)
                      .toLocaleString()}
                  </strong>
                </div>
              </Card.Body>
            </Card>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Destinatarios (Email)</Form.Label>
            <Form.Control
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="ejemplo@correo.com, otro@correo.com"
              required
            />
            <Form.Text className="text-muted">
              Separe múltiples emails con comas
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mensaje Personalizado (Opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Agregue un mensaje personalizado para los destinatarios..."
            />
          </Form.Group>

          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Información:</strong> Los destinatarios recibirán un email
            con la lista de útiles escolares, incluyendo los materiales,
            cantidades y precios estimados.
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !selectedLista || !emails.trim()}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Enviando...
            </>
          ) : (
            <>
              <i className="bi bi-envelope me-2"></i>
              Compartir Lista
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CompartirListaModal;
