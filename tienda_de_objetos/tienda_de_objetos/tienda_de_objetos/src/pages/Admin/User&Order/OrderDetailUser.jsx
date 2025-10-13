import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetailUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = {
    id: id,
    date: `2025-09-${(id % 30) + 1}`,
    total: (Math.random() * 100 + 20).toFixed(2),
    items: Math.floor(Math.random() * 5) + 1,
  };

  function handleCancel() {
    alert("La orden ha sido cancelada.");
    navigate(-1); // vuelve a la página anterior
  }

  if (!order) return <div>No se encontró la orden.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Detalle de Orden #{order.id}</h3>
      <p><b>Fecha:</b> {order.date}</p>
      <p><b>Total:</b> ${order.total}</p>
      <p><b>Artículos:</b> {order.items}</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button onClick={() => navigate(-1)}>Volver</button>
        <button style={{ background: "#c00", color: "#fff" }} onClick={handleCancel}>Cancelar orden</button>
      </div>
    </div>
  );
}