import React from "react";

const EtiquetasBadge = ({ etiquetas = [], size = "sm", className = "" }) => {
  if (!etiquetas || etiquetas.length === 0) {
    return null;
  }

  const badgeSize = size === "lg" ? "badge-lg" : "";

  return (
    <div className={`etiquetas-container ${className}`}>
      {etiquetas.map((etiqueta) => (
        <span
          key={etiqueta._id}
          className={`badge ${badgeSize} me-1 mb-1`}
          style={{
            backgroundColor: etiqueta.color || "#007bff",
            color: "#fff",
            fontSize: size === "lg" ? "0.9rem" : "0.75rem",
          }}
          title={etiqueta.descripcion}
        >
          {etiqueta.icono && <i className={`bi bi-${etiqueta.icono} me-1`}></i>}
          {etiqueta.nombre}
        </span>
      ))}
    </div>
  );
};

export default EtiquetasBadge;
