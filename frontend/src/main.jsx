import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext-simple";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

console.log("🚀 Aplicación completa iniciando...");

const root = document.getElementById("root");
console.log("Elemento root encontrado:", root);

if (root) {
  try {
    const reactRoot = ReactDOM.createRoot(root);
    console.log("ReactDOM.createRoot exitoso");
    
    reactRoot.render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    console.log("✅ Aplicación completa renderizada");
  } catch (error) {
    console.error("❌ Error al renderizar:", error);
    root.innerHTML = `<h1>Error: ${error.message}</h1>`;
  }
} else {
  console.error("❌ No se encontró el elemento #root");
}
