import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import materialsService from "../../services/materialsService";
import categoriesService from "../../services/categoriesService";
import levelsService from "../../services/levelsService";

function DocenteMaterials() {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoria: "",
    nivel: "",
    search: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [materialsData, categoriesData, levelsData] = await Promise.all([
        materialsService.getMaterials(),
        categoriesService.getCategories(),
        levelsService.getLevels(),
      ]);

      setMaterials(materialsData);
      setCategories(categoriesData);
      setLevels(levelsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory =
      !filters.categoria || material.categoria?._id === filters.categoria;
    const matchesLevel =
      !filters.nivel || material.nivel?._id === filters.nivel;
    const matchesSearch =
      !filters.search ||
      material.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      material.descripcion.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  if (loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Catálogo de Materiales</h1>
        </div>

        {/* Filtros */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Buscar</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o descripción..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={filters.categoria}
                  onChange={(e) =>
                    setFilters({ ...filters, categoria: e.target.value })
                  }
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Nivel</label>
                <select
                  className="form-select"
                  value={filters.nivel}
                  onChange={(e) =>
                    setFilters({ ...filters, nivel: e.target.value })
                  }
                >
                  <option value="">Todos los niveles</option>
                  {levels.map((level) => (
                    <option key={level._id} value={level._id}>
                      {level.nombre} ({level.grado})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de materiales */}
        <div className="row">
          {filteredMaterials.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">
                <i className="bi bi-info-circle me-2"></i>
                No se encontraron materiales con los filtros aplicados.
              </div>
            </div>
          ) : (
            filteredMaterials.map((material) => (
              <div key={material._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{material.nombre}</h5>
                      <span
                        className={`badge ${
                          material.disponible ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {material.disponible ? "Disponible" : "No disponible"}
                      </span>
                    </div>

                    <p className="card-text text-muted small mb-2">
                      {material.descripcion}
                    </p>

                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Categoría:</strong>{" "}
                        {material.categoria?.nombre || "N/A"}
                      </small>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Nivel:</strong> {material.nivel?.nombre} (
                        {material.nivel?.grado})
                      </small>
                    </div>

                    <div className="mb-3">
                      <strong className="text-primary">
                        ₡{material.precio?.toLocaleString()}
                      </strong>
                    </div>

                    {/* Etiquetas */}
                    <div className="mb-2">
                      {material.etiquetas?.map((etiqueta) => (
                        <span
                          key={etiqueta._id}
                          className="badge me-1 mb-1"
                          style={{
                            backgroundColor: etiqueta.color,
                            color: "#fff",
                          }}
                        >
                          <i className={`bi bi-${etiqueta.icono} me-1`}></i>
                          {etiqueta.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estadísticas */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Estadísticas</h5>
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="d-flex flex-column">
                      <span className="h4 mb-0 text-primary">
                        {materials.length}
                      </span>
                      <small className="text-muted">Total Materiales</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex flex-column">
                      <span className="h4 mb-0 text-success">
                        {filteredMaterials.length}
                      </span>
                      <small className="text-muted">Filtrados</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex flex-column">
                      <span className="h4 mb-0 text-info">
                        {categories.length}
                      </span>
                      <small className="text-muted">Categorías</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex flex-column">
                      <span className="h4 mb-0 text-warning">
                        {levels.length}
                      </span>
                      <small className="text-muted">Niveles</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DocenteMaterials;
