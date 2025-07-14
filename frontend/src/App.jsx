import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { useAuth } from "./context/AuthContext-simple";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminMaterials from "./pages/Admin/Materials";
import AdminLists from "./pages/Admin/Lists";
import DocenteDashboard from "./pages/Docente/Dashboard";
import DocenteListas from "./pages/Docente/Lists";
import DocenteMaterials from "./pages/Docente/Materials";
import PadreDashboard from "./pages/Padre/Dashboard";
import PadreDashboardSimple from "./pages/Padre/DashboardSimple";
import PadreListas from "./pages/Padre/Lists";
import PadreResumen from "./pages/Padre/Resumen";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas para Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/materials"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminMaterials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lists"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLists />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para Profesor */}
          <Route
            path="/docente/dashboard"
            element={
              <ProtectedRoute allowedRoles={["profesor", "admin"]}>
                <DocenteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docente/listas"
            element={
              <ProtectedRoute allowedRoles={["profesor", "admin"]}>
                <DocenteListas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docente/materials"
            element={
              <ProtectedRoute allowedRoles={["profesor", "admin"]}>
                <DocenteMaterials />
              </ProtectedRoute>
            }
          />

          {/* Ruta de DEBUG temporal */}
          <Route
            path="/debug"
            element={
              <div className="container mt-5">
                <div className="alert alert-info">
                  <h3>🔍 Debug Route</h3>
                  <p>Esta es una ruta de prueba para verificar navegación</p>
                </div>
              </div>
            }
          />

          {/* Ruta SIMPLE para padre (sin ProtectedRoute) */}
          <Route path="/padre/simple" element={<PadreDashboardSimple />} />

          {/* Rutas protegidas para Padre */}
          <Route
            path="/padre/dashboard"
            element={
              <ProtectedRoute allowedRoles={["padre"]}>
                <PadreDashboardSimple />
              </ProtectedRoute>
            }
          />
          <Route
            path="/padre/listas"
            element={
              <ProtectedRoute allowedRoles={["padre"]}>
                <PadreListas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/padre/resumen"
            element={
              <ProtectedRoute allowedRoles={["padre"]}>
                <PadreResumen />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
