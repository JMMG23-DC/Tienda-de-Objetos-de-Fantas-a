import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const mockUsers = [
  { id: 1, nombre: "Ana", apellido: "Torres", correo: "ana.torres@gmail.com", activo: true },
  { id: 2, nombre: "Luis", apellido: "Doig", correo: "doigluis@gmail.com", activo: false },
  { id: 3, nombre: "Maria", apellido: "Rojas", correo: "marojas@gmail.com", activo: true },
  { id: 4, nombre: "Carlos", apellido: "Lazo", correo: "clazo@hotmail.com", activo: false },
  { id: 5, nombre: "Sofia", apellido: "Lopez", correo: "soflopez@hotmail.com", activo: true },
];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useMemo(() => mockUsers.find(u => u.id === Number(id)), [id]);
  if (!user) return <div>No se encontró el usuario.</div>;

  // Simulación de órdenes del usuario (máx 10)
  const orders = Array.from({ length: Math.min(10, user.id + 3) }, (_, i) => ({
    id: i + 1,
    date: `2025-09-${(i % 30) + 1}`,
    total: (Math.random() * 100 + 20).toFixed(2),
    items: Math.floor(Math.random() * 5) + 1,
  }));

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Detalle de usuario</h3>
      <p><b>ID:</b> {user.id}</p>
      <p><b>Nombre:</b> {user.nombre}</p>
      <p><b>Apellido:</b> {user.apellido}</p>
      <p><b>Correo:</b> {user.correo}</p>
      <p><b>Estado:</b> {user.activo ? "Activo" : "Desactivado"}</p>

      <h4>Órdenes recientes</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orders.map(order => (
          <li key={order.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <b>Orden #{order.id}</b> - {order.date} - {order.items} artículo(s) - 
            <span style={{ color: "#2a7" }}> ${order.total}</span>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>Volver</button>
    </div>
  );
}