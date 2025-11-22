import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetailUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/ordenes/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("ERROR FRONT:", err);
        setLoading(false);
      });
  }, [id]);

  // Función para cambiar estado a "Cancelado"
  const handleCancelOrder = async () => {
    if (!order) return;
    setUpdating(true);

    try {
      const res = await fetch(`http://localhost:3000/ordenes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Cancelado" })
      });

      if (!res.ok) throw new Error("Error al actualizar la orden");

      setOrder(prev => ({ ...prev, estado: "Cancelado" }));
      setUpdating(false);
    } catch (err) {
      console.error("ERROR CANCELAR ORDEN:", err);
      setUpdating(false);
      alert("No se pudo cancelar la orden.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!order) return <p>No se encontró la orden.</p>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0002"
      }}
    >
      <h2>Detalle de Orden #{order.id_orden}</h2>

      <p><b>Usuario:</b> {order.user?.nombre}</p>
      <p><b>Email:</b> {order.user?.email}</p>
      <p><b>Estado:</b> {order.estado}</p>

      {order.estado === "Pendiente" && (
        <button
          onClick={handleCancelOrder}
          disabled={updating}
        >
          {updating ? "Actualizando..." : "Cancelar Orden"}
        </button>
      )}

      <h3 style={{ marginTop: "1.5rem" }}>Productos</h3>
      {order.orden_productos?.map((op, i) => (
        <div key={i} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
          <p><b>{op.producto?.nombre}</b></p>
          <p>Cantidad: {op.cantidad}</p>
          <p>Subtotal: S/ {op.subtotal.toFixed(2)}</p>
        </div>
      ))}

      <h3 style={{ marginTop: "1.5rem" }}>Pago</h3>
      <p><b>Método:</b> {order.pago?.metodo_pago}</p>
      <p><b>Estado:</b> {order.pago?.estado_pago}</p>
      <p><b>Fecha:</b> {order.pago?.fecha_pago ? new Date(order.pago.fecha_pago).toLocaleDateString() : "-"}</p>

      <h3 style={{ marginTop: "1.5rem" }}>Envío</h3>
      <p><b>Ciudad:</b> {order.envio?.ciudad}</p>
      <p><b>Dirección:</b> {order.envio?.direccion}</p>
      <p><b>Método:</b> {order.envio?.metodo_envio}</p>

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
        Volver
      </button>
    </div>
  );
}
