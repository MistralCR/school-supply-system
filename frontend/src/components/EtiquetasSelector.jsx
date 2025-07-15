import React, { useState, useEffect } from "react";
import { obtenerEtiquetas } from "../services/etiquetasService";

const EtiquetasSelector = ({
  etiquetasSeleccionadas = [],
  onChange,
  multiple = true,
  placeholder = "Seleccionar etiquetas...",
  disabled = false,
}) => {
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEtiquetas();
  }, []);

  const cargarEtiquetas = async () => {
    try {
      setLoading(true);
      const data = await obtenerEtiquetas();
      setEtiquetas(data);
    } catch (error) {
      setError(error);
      console.error("Error cargando etiquetas:", error);
    } finally {
      setLoading(false);
    }
  };

  const manejarSeleccion = (etiquetaId) => {
    if (!multiple) {
      onChange([etiquetaId]);
      return;
    }

    const nuevasSeleccionadas = etiquetasSeleccionadas.includes(etiquetaId)
      ? etiquetasSeleccionadas.filter((id) => id !== etiquetaId)
      : [...etiquetasSeleccionadas, etiquetaId];

    onChange(nuevasSeleccionadas);
  };

  const limpiarSeleccion = () => {
    onChange([]);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <div
          className="spinner-border spinner-border-sm me-2"
          role="status"
        ></div>
        <span>Cargando etiquetas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error al cargar etiquetas: {error}
      </div>
    );
  }

  return (
    <div className="etiquetas-selector">
      <div className="mb-2">
        <small className="text-muted">
          {placeholder}
          {multiple && etiquetasSeleccionadas.length > 0 && (
            <button
              type="button"
              className="btn btn-link btn-sm p-0 ms-2"
              onClick={limpiarSeleccion}
              disabled={disabled}
            >
              <i className="bi bi-x-circle"></i> Limpiar
            </button>
          )}
        </small>
      </div>

      <div className="d-flex flex-wrap gap-2">
        {etiquetas.map((etiqueta) => {
          const isSelected = etiquetasSeleccionadas.includes(etiqueta._id);

          return (
            <button
              key={etiqueta._id}
              type="button"
              className={`btn btn-outline-primary btn-sm ${
                isSelected ? "active" : ""
              }`}
              onClick={() => manejarSeleccion(etiqueta._id)}
              disabled={disabled}
              style={{
                borderColor: etiqueta.color,
                color: isSelected ? "#fff" : etiqueta.color,
                backgroundColor: isSelected ? etiqueta.color : "transparent",
              }}
              title={etiqueta.descripcion}
            >
              {etiqueta.icono && (
                <i className={`bi bi-${etiqueta.icono} me-1`}></i>
              )}
              {etiqueta.nombre}
              {isSelected && multiple && <i className="bi bi-check ms-1"></i>}
            </button>
          );
        })}
      </div>

      {etiquetasSeleccionadas.length > 0 && (
        <div className="mt-2">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            {etiquetasSeleccionadas.length} etiqueta(s) seleccionada(s)
          </small>
        </div>
      )}
    </div>
  );
};

export default EtiquetasSelector;
