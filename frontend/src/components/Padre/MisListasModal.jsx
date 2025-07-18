import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Badge, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import padreService from "../../services/padreService";

function MisListasModal({ show, onHide }) {
  const { user } = useAuth();
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLista, setSelectedLista] = useState(null);

  useEffect(() => {
    if (show) {
      loadListas();
    }
  }, [show]);

  const loadListas = async () => {
    try {
      setLoading(true);
      // Usar datos simulados por ahora
      const data = await padreService.getMisListasSimulado();
      setListas(data);
    } catch (error) {
      console.error("Error al cargar listas:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComprado = async (listaId, materialId, comprado) => {
    try {
      // Actualizar localmente por ahora
      setListas(
        listas.map((lista) => {
          if (lista._id === listaId) {
            return {
              ...lista,
              materiales: lista.materiales.map((material) => {
                if (material._id === materialId) {
                  return { ...material, comprado: !comprado };
                }
                return material;
              }),
            };
          }
          return lista;
        })
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const calcularProgreso = (materiales) => {
    const comprados = materiales.filter((m) => m.comprado).length;
    return Math.round((comprados / materiales.length) * 100);
  };

  const calcularTotal = (materiales) => {
    return materiales.reduce(
      (total, material) => total + material.precio * material.cantidad,
      0
    );
  };

  const calcularComprado = (materiales) => {
    return materiales
      .filter((m) => m.comprado)
      .reduce(
        (total, material) => total + material.precio * material.cantidad,
        0
      );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-list-ul me-2"></i>
          Mis Listas de Útiles - {user?.nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : listas.length > 0 ? (
          <div className="row">
            {listas.map((lista) => {
              const progreso = calcularProgreso(lista.materiales);
              const total = calcularTotal(lista.materiales);
              const comprado = calcularComprado(lista.materiales);

              return (
                <div key={lista._id} className="col-md-6 mb-3">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{lista.titulo}</h6>
                      <Badge bg={progreso === 100 ? "success" : "primary"}>
                        {progreso}% Completo
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted mb-2">
                        <i className="bi bi-person me-1"></i>
                        {lista.profesor} • {lista.grado}
                      </p>

                      <div className="mb-3">
                        <div className="progress mb-2">
                          <div
                            className="progress-bar"
                            style={{ width: `${progreso}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          {lista.materiales.filter((m) => m.comprado).length} de{" "}
                          {lista.materiales.length} útiles comprados
                        </small>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <strong>Total: ₡{total.toLocaleString()}</strong>
                        </div>
                        <div className="col-6">
                          <span className="text-success">
                            Comprado: ₡{comprado.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Table size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th>Útil</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lista.materiales.map((material) => (
                            <tr key={material._id}>
                              <td
                                className={
                                  material.comprado
                                    ? "text-decoration-line-through"
                                    : ""
                                }
                              >
                                {material.nombre}
                              </td>
                              <td>{material.cantidad}</td>
                              <td>
                                ₡
                                {(
                                  material.precio * material.cantidad
                                ).toLocaleString()}
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  variant={
                                    material.comprado
                                      ? "success"
                                      : "outline-secondary"
                                  }
                                  onClick={() =>
                                    toggleComprado(
                                      lista._id,
                                      material._id,
                                      material.comprado
                                    )
                                  }
                                >
                                  {material.comprado ? (
                                    <>
                                      <i className="bi bi-check-circle me-1"></i>
                                      Comprado
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-circle me-1"></i>
                                      Pendiente
                                    </>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            No tienes listas de útiles asignadas aún.
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MisListasModal;
