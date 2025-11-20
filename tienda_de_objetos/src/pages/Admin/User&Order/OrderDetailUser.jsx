import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetailUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);

  // 1. Cargar detalle completo de la orden
  useEffect(() => {
    fetch(`http://localhost:4000/admin/ordenes/${id}`)
      .then((res) => res.json())
      .then((data) => setOrden(data))
      .catch((err) => console.error("Error cargando orden:", err));
  }, [id]);

  // 2. Función para Cancelar Orden
  const handleCancel = async () => {
    if (!window.confirm("¿Estás seguro que deseas CANCELAR esta orden? Esta acción no se puede deshacer.")) return;

    try {
      const response = await fetch(`http://localhost:4000/admin/ordenes/${id}/cancelar`, {
        method: "PUT"
      });

      if (response.ok) {
        alert("Orden cancelada exitosamente.");
        // Actualizamos el estado local
        setOrden({ ...orden, estado: "Cancelado" });
      } else {
        alert("No se pudo cancelar la orden.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    }
  };

  if (!orden) return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando detalles de la orden...</div>;

  // Calcular total de la orden (sumando subtotales)
  const totalCalculado = orden.productos.reduce((acc, prod) => acc + prod.orden_producto.subtotal, 0);

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <button onClick={() => navigate("/OrderList")} style={{ marginBottom: "1rem", cursor: "pointer" }}>
        &larr; Volver al Listado
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "1rem", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0 }}>Orden #{orden.id_orden}</h2>
        <span style={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          padding: "5px 10px",
          borderRadius: "4px",
          background: orden.estado === "Cancelado" ? "#ffebee" : "#e8f5e9",
          color: orden.estado === "Cancelado" ? "#c62828" : "#2e7d32"
        }}>
          {orden.estado}
        </span>
      </div>

      {/* Sección de Información General */}
      <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Datos del Cliente</h4>
          <p style={{ margin: "5px 0" }}><strong>Nombre:</strong> {orden.user ? orden.user.nombre : "Desconocido"}</p>
          <p style={{ margin: "5px 0" }}><strong>Email:</strong> {orden.user ? orden.user.email : "-"}</p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Detalles de Envío y Pago</h4>
          <p style={{ margin: "5px 0" }}><strong>Fecha:</strong> {new Date(orden.fecha_orden).toLocaleString()}</p>
          <p style={{ margin: "5px 0" }}><strong>Pago:</strong> {orden.pago ? orden.pago.metodo_pago : "N/A"}</p>
          <p style={{ margin: "5px 0" }}><strong>Envío:</strong> {orden.envio ? `${orden.envio.metodo_envio} - ${orden.envio.direccion}` : "N/A"}</p>
        </div>
      </div>

      {/* Tabla de Productos */}
      <h3>Productos en la Orden</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Producto</th>
            <th style={{ padding: "8px", textAlign: "center" }}>Cant.</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orden.productos.map((prod) => (
            <tr key={prod.id_producto} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{prod.nombre}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{prod.orden_producto.cantidad}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>S/. {prod.orden_producto.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: "right", padding: "15px 8px", fontWeight: "bold", fontSize: "1.2rem" }}>Total Final:</td>
            <td style={{ textAlign: "right", padding: "15px 8px", fontWeight: "bold", fontSize: "1.2rem", color: "#d32f2f" }}>
              S/. {totalCalculado.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Botón de Cancelar (Solo si no está cancelada ya) */}
      {orden.estado !== "Cancelado" && (
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handleCancel}
            style={{
              background: "#c0392b",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            }}
          >
            Cancelar Orden
          </button>
        </div>
      )}
    </div>
  );
}