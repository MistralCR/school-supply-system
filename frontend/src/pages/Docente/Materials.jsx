import React from "react";
import { Navigate } from "react-router-dom";

function DocenteMaterials() {
  // Por ahora redirigir al dashboard ya que los profesores pueden ver materiales desde admin
  return <Navigate to="/admin/materials" replace />;
}

export default DocenteMaterials;
