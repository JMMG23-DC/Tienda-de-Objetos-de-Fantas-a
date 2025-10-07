import { useState } from "react";

// Simulación de órdenes recientes
const mockOrders = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  date: `2025-09-${(i % 30) + 1}`,
  total: (Math.random() * 100 + 20).toFixed(2),
  items: Math.floor(Math.random() * 5) + 1,
}));

export default function UserAccount({ onOrderDetail, onEditUser, onChangePassword }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(mockOrders.length / pageSize);
  const orders = mockOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Mi cuenta</h2>
  <button style={{ marginBottom: "1rem" }} onClick={onEditUser}>Editar datos de usuario</button>
  <button style={{ marginBottom: "1rem", marginLeft: "1rem" }} onClick={onChangePassword}>Cambiar contraseña</button>
      <h4>Órdenes recientes</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orders.map(order => (
          <li key={order.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => onOrderDetail(order)}>
            <b>Orden #{order.id}</b> - {order.date} - {order.items} artículo(s) - <span style={{ color: "#2a7" }}>${order.total}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}
