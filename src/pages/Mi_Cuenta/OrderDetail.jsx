import { useParams, Link } from "react-router-dom";
import { usersData } from "../../data/usersData";
import { TopBar } from "../Home/components/TopBar";
import "./OrderDetail.css";

export const OrderDetail = () => {
  const { id } = useParams();

 
  const usuario = usersData.find((orden) => orden.id === parseInt(id));

  // Mostrar botón solo si el pedido no está entregado
  const mostrarBotonCancelar =
    usuario.estado_entrega.toLowerCase() !== "entregado" &&
    usuario.estado_entrega.toLowerCase() !== "completado";

  const handleCancelar = () => {
    alert(`Pedido #${usuario.id} ha sido cancelado.`);
  };

  return (
    <>
      <TopBar />
      <div className="order-detail-container">
        <div className="order-card">
          <h2 className="order-title">Detalles del pedido #{usuario.id}</h2>

          <img
            className="order-image"
            src={usuario.imagen}
            alt={usuario.producto}
          />

          <div className="order-info">
            <p><strong>Usuario:</strong> {usuario.nombre_usuario}</p>
            <p><strong>Producto:</strong> {usuario.producto}</p>
            <p><strong>Estado:</strong> {usuario.estado_entrega}</p>
            <p><strong>Fecha:</strong> {usuario.fecha}</p>
            <p><strong>Cantidad:</strong> {usuario.cantidad}</p>
            <p><strong>Pago:</strong> S/. {usuario.pago}</p>
          </div>

          <div className="order-buttons">
            <Link to={`/Sesion`} className="orden-butt volver"> Volver </Link>

            {mostrarBotonCancelar && (
              <button className="orden-butt cancelar" onClick={handleCancelar}>
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
