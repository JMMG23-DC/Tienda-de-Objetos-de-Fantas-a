import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulación de órdenes
const mockOrders = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nombre: `Nombre${(i % 7) + 1}`,
  apellido: `Apellido${(i % 5) + 1}`,
  total: (Math.random() * 200 + 50).toFixed(2),
  date: `2025-09-${(i % 30) + 1}`.padStart(10, "0"),
}));

export default function OrderList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState("");

  const filtered = mockOrders.filter(order =>
    order.id.toString().includes(filter) ||
    order.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    order.apellido.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Listado de órdenes</h2>
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o apellido"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>No se encontraron órdenes.</td>
            </tr>
          ) : (
            filtered.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.nombre}</td>
                <td>{order.apellido}</td>
                <td>{order.date}</td>
                <td>${order.total}</td>
                <td>
                  <button
                   onClick={() => navigate("/OrderDetailUser/" + order.id)}
                    style={{ padding: "0.3rem 0.7rem", borderRadius: 4, border: "none", background: "#007bff", color: "#fff", cursor: "pointer" }}
                  >
                    Ver detalle
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
