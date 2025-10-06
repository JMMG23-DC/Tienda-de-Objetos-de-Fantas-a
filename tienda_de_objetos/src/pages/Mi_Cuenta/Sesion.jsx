import { useState } from "react";
import { useParams, NavLink, Link } from "react-router-dom";
import { usersData } from "../../data/usersData";
import { TopBar } from "../Home/components/TopBar";
import "./Sesion.css";

export const Sesion = () => {
  const { nombre } = useParams();

  // Filtramos las órdenes del usuario
  const usuarioOrdenes = usersData.filter(
    (user) => user.nombre_usuario === nombre
  );

  if (usuarioOrdenes.length === 0) {
    return (
      <>
        <TopBar />
        <section className="sesion-container">
          <h1 className="sesion-titulo">Usuario no encontrado</h1>
        </section>
      </>
    );
  }

  // ----- Paginación -----
  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 5;
  const indiceInicial = (paginaActual - 1) * ordenesPorPagina;
  const indiceFinal = indiceInicial + ordenesPorPagina;
  const ordenesActuales = usuarioOrdenes.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(usuarioOrdenes.length / ordenesPorPagina);

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <>
      {/* 🔹 El TopBar va fuera para no heredar el fondo */}
      <TopBar />

      <section className="sesion-container">
        <div className="sesion-contenido">
          {/* Panel Izquierdo */}
          <div className="sesion-panel">
            <h2>Cuenta {nombre}</h2>
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

            <div className="ordenes-lista">
              
              {ordenesActuales.map((orden) => (
                <div className="orden-item" key={orden.id}>
                  <img
                    className="orden-img"
                    src={orden.imagen}
                    alt={orden.producto}
                  />
                  <div>
                    <h3>{orden.producto}</h3>
                    <p>Estado: {orden.estado_entrega}</p>
                    <button className="orden-butt"> <Link to = {"/OrderDetail/"+orden.id} >Ver Detalle</Link> </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="paginacion">
              <button onClick={paginaAnterior} disabled={paginaActual === 1}>
                {"<"}
              </button>
              <span>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sesion;
