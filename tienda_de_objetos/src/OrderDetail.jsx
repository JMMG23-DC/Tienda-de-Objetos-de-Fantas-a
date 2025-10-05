export default function OrderDetail({ order, onBack }) {
  if (!order) return null;
  function handleCancel() {
    alert("La orden ha sido cancelada.");
    onBack();
  }
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Detalle de Orden #{order.id}</h3>
      <p><b>Fecha:</b> {order.date}</p>
      <p><b>Total:</b> ${order.total}</p>
      <p><b>Artículos:</b> {order.items}</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button onClick={onBack}>Volver</button>
        <button style={{ background: "#c00", color: "#fff" }} onClick={handleCancel}>Cancelar orden</button>
      </div>
    </div>
  );
}
