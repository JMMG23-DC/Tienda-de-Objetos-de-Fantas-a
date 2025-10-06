import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./Sesion.css";

export const Sesion = () => {
  const { nombre } = useParams();

  // Lista de órdenes (puedes reemplazar luego con datos reales)
  const [ordenes] = useState([
    { id: 1, producto: "Varita de Roble", estado: "En camino", fecha: "06/10/2025", precio: "120 G", imagen: "/img/varita.jpg" },
    { id: 2, producto: "Poción de Invisibilidad", estado: "Entregado", fecha: "01/10/2025", precio: "80 G", imagen: "/img/pocion.jpg" },
    { id: 3, producto: "Mapa del Merodeador", estado: "Pendiente", fecha: "03/10/2025", precio: "200 G", imagen: "/img/mapa.jpg" },
  ]);

  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  // Cancelar orden
  const handleCancelar = (id) => {
      alert("La orden ha sido cancelada correctamente.");
  };

  return (
    <section className="sesion-container">
      <h1 className="sesion-titulo">Bienvenido, {nombre}</h1>

      <div className="sesion-contenido">
        {/* Panel Izquierdo */}
        <div className="sesion-panel">
          <h2>Mi Cuenta</h2>
          <NavLink to={`/Edit/${nombre}`} className="sesion-btn">
            Editar Perfil
          </NavLink>
          <NavLink to={`/ChangePassword/${nombre}`} className="sesion-btn">
            Cambiar Contraseña
          </NavLink>
        </div>

        {/* Panel Derecho */}
        <div className="sesion-ordenes">
          <h2>Mis Órdenes Recientes</h2>

          {!ordenSeleccionada ? (
            <>
              <div className="ordenes-lista">
                {ordenes.map((orden) => (
                  <div
                    key={orden.id}
                    className="orden-item"
                    onClick={() => setOrdenSeleccionada(orden)}
                  >
                    <img
                      src={orden.imagen}
                      alt={orden.producto}
                      className="orden-img"
                    />
                    <div>
                      <h3>{orden.producto}</h3>
                      <p>Estado: {orden.estado}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación (solo visual) */}
              <div className="paginacion">
                <button>{"<"}</button>
                <span>Página 1 de 3</span>
                <button>{">"}</button>
              </div>
            </>
          ) : (
            <div className="orden-detalle">
              <button className="btn-volver" onClick={() => setOrdenSeleccionada(null)}>
                ← Volver a mis órdenes
              </button>
              <h2>Detalle de la Orden #{ordenSeleccionada.id}</h2>
              <img
                src={ordenSeleccionada.imagen}
                alt={ordenSeleccionada.producto}
                className="orden-detalle-img"
              />
              <p><strong>Producto:</strong> {ordenSeleccionada.producto}</p>
              <p><strong>Estado:</strong> {ordenSeleccionada.estado}</p>
              <p><strong>Fecha:</strong> {ordenSeleccionada.fecha}</p>
              <p><strong>Precio:</strong> {ordenSeleccionada.precio}</p>
              <button
                className="btn-cancelar"
                onClick={() => handleCancelar(ordenSeleccionada.id)}
                disabled={ordenSeleccionada.estado === "Cancelada" || ordenSeleccionada.estado === "Entregado"}
              >
                {ordenSeleccionada.estado === "Cancelada"
                  ? "Orden Cancelada"
                  : "Cancelar Orden"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Sesion;
