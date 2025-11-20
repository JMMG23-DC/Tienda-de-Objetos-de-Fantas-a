import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [filter, setFilter] = useState("");

  // 1. Cargar órdenes desde el Backend
  useEffect(() => {
    fetch("http://localhost:4000/admin/ordenes")
      .then((res) => res.json())
      .then((data) => setOrdenes(data))
      .catch((err) => console.error("Error al cargar órdenes:", err));
  }, []);

  // 2. Filtrar por ID de orden o Nombre de usuario
  const filtered = ordenes.filter((o) =>
    o.id_orden.toString().includes(filter) ||
    (o.usuario && o.usuario.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2>Gestión de Órdenes (Admin)</h2>
      
      <button onClick={() => navigate("/AdminDashboard")} style={{ marginBottom: "1rem", cursor: "pointer" }}>
        &larr; Volver al Dashboard
      </button>

      <input
        type="text"
        placeholder="Filtrar por #Orden o Nombre del Cliente..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "10px" }}>#ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No se encontraron órdenes.</td>
            </tr>
          ) : (
            filtered.map((orden) => (
              <tr key={orden.id_orden} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}><strong>#{orden.id_orden}</strong></td>
                <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                <td>{orden.usuario}</td>
                <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
                  S/. {orden.total.toFixed(2)}
                </td>
                <td>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background: orden.estado === "Cancelado" ? "#ffebee" : 
                                orden.estado === "Completado" ? "#e8f5e9" : "#e3f2fd",
                    color: orden.estado === "Cancelado" ? "#c62828" : 
                           orden.estado === "Completado" ? "#2e7d32" : "#1565c0"
                  }}>
                    {orden.estado}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/OrderDetailUser/${orden.id_orden}`)}
                    style={{
                      padding: "5px 10px",
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}