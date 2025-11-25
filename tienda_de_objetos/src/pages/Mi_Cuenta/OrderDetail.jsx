import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Importaciones activas como solicitaste
import { TopBar } from "../Home/components/TopBar";
import "./OrderDetail.css";

export const OrderDetail = () => {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener datos del Backend al cargar la página
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://3.131.85.192:3000/orders/${id}`);
        if (!response.ok) throw new Error("No se encontró la orden");
        const data = await response.json();
        setOrden(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los detalles.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Función para manejar el clic en "Cancelar Pedido"
  const handleCancelar = async () => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

    try {
      // Llamada al Backend para actualizar la base de datos
      const response = await fetch(`http://3.131.85.192:3000/orders/${id}/cancel`, {
        method: "PUT",
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("Pedido cancelado exitosamente.");
        // Actualizar estado localmente para que el usuario vea el cambio al instante
        setOrden({ ...orden, estado: "Cancelado" });
      } else {
        alert(data.error || "No se puede cancelar el pedido.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  if (loading) return <div className="order-detail-container"><p>Cargando...</p></div>;
  if (error || !orden) return <div className="order-detail-container"><p>{error || "No hay datos."}</p></div>;

  // Calcular total (suma de subtotales de la tabla intermedia)
  const totalPago = orden.productos ? orden.productos.reduce((acc, prod) => acc + prod.orden_producto.subtotal, 0) : 0;

  // Usar la primera imagen del producto como imagen principal de la tarjeta (si existe)
  const mainImage = (orden.productos && orden.productos.length > 0) ? orden.productos[0].imagen_url : "https://via.placeholder.com/150";

  return (
    <>
      <TopBar />
      <div className="order-detail-container">
        <div className="order-card">
          <h2 className="order-title">Detalles del Pedido #{orden.id_orden}</h2>

          <img
            className="order-image"
            src={mainImage}
            alt="Imagen del Producto"
          />

          <div className="order-info">
            <p><strong>Usuario:</strong> {orden.user ? orden.user.nombre : "Desconocido"}</p>
            
            {/* Lista de productos */}
            <div style={{ margin: "10px 0", borderTop: "1px solid #eee", paddingTop: "5px" }}>
              <p><strong>Productos:</strong></p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9em" }}>
                {orden.productos && orden.productos.map((prod) => (
                  <li key={prod.id_producto}>
                    - {prod.nombre} (x{prod.orden_producto.cantidad})
                  </li>
                ))}
              </ul>
            </div>

            <p><strong>Estado:</strong> <span style={{ color: orden.estado === 'Cancelado' ? 'red' : 'green', fontWeight: 'bold' }}>{orden.estado}</span></p>
            <p><strong>Fecha:</strong> {new Date(orden.fecha_orden).toLocaleDateString()}</p>
            <p><strong>Método de Pago:</strong> {orden.pago ? orden.pago.metodo_pago : "Pendiente"}</p>
            <p><strong>Total a Pagar:</strong> S/. {totalPago.toFixed(2)}</p>
            {orden.envio && <p><strong>Dirección:</strong> {orden.envio.direccion}, {orden.envio.ciudad}</p>}
          </div>

          <div className="order-buttons">
            <Link to={`/Sesion`} className="orden-butt volver"> Volver </Link>

            {/* Solo mostrar botón cancelar si no está entregado ni cancelado */}
            {orden.estado !== "Entregado" && orden.estado !== "Cancelado" ? (
              <button className="orden-butt cancelar" onClick={handleCancelar}>
                Cancelar Pedido
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;