import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../Home/components/TopBar";
import "./Sesion.css";

export const Sesion = () => {
  // 1. Obtener datos de localStorage
  const nombre = localStorage.getItem("nombre");
  // const usuario_id = localStorage.getItem("usuario_id"); // Ya no se usa para la lógica principal
  const navigate = useNavigate();

  // 2. Estados para las órdenes (que vendrán del fetch) y la carga
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. useEffect para cargar los datos del backend
  useEffect(() => {
    // Si no hay NOMBRE, no está logueado
    if (!nombre) {
      navigate("/login");
      return;
    }

    // Función async para hacer el fetch
    const fetchOrdenes = async () => {
      try {
        setLoading(true);
        // --- ¡CAMBIO IMPORTANTE! ---
        // Llamamos a la ruta del backend que usa el NOMBRE
        const response = await fetch(`http://localhost:4000/mis-ordenes/${nombre}`);
        
        if (!response.ok) {
          throw new Error("Error al cargar las órdenes");
        }
        
        const data = await response.json();
        setOrdenes(data); // Guardamos las órdenes
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Termina la carga (incluso si hay error)
      }
    };

    fetchOrdenes();
  }, [nombre, navigate]); // Se ejecuta si el 'nombre' cambia

  // 4. Lógica de Paginación (ahora usa el estado 'ordenes')
  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 5;
  const indiceInicial = (paginaActual - 1) * ordenesPorPagina;
  const indiceFinal = indiceInicial + ordenesPorPagina;
  const ordenesActuales = ordenes.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ordenes.length / ordenesPorPagina);

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };
  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  // 5. Cerrar Sesión (Limpia ambos items por si acaso)
  const cerrar_sesion = () => {
    localStorage.removeItem("nombre");
    localStorage.removeItem("usuario_id"); // <-- Se deja para limpiar
    navigate("/");
  };

  // 6. Manejo del estado de carga (Loading)
  if (loading) {
    return (
      <>
        <TopBar />
        <section className="sesion-container">
          <h1 className="sesion-titulo">Cargando tu perfil...</h1>
        </section>
      </>
    );
  }

  // 7. Renderizado (JSX)
  return (
    <>
      <TopBar />
      <section className="sesion-container">
        <div className="sesion-contenido">
          {/* Panel Izquierdo */}
          <div className="sesion-panel">
            <h2>Cuenta {nombre}</h2>
            <button onClick={() => navigate("/Edit")} className="sesion-btn" style={{ width: "100%" }}>
              Editar Perfil
            </button>
            <button onClick={() => navigate("/ChangePassword")} className="sesion-btn" style={{ width: "100%" }}>
              Cambiar Contraseña
            </button>
            <button onClick={cerrar_sesion} className="sesion-btn" style={{ width: "100%" }}>
              Cerrar Sesion
            </button>
          </div>

          {/* Panel Derecho */}
          <div className="sesion-ordenes">
            <h2>Mis Órdenes Recientes</h2>

            {/* Manejo si no hay órdenes */}
            {ordenes.length === 0 ? (
              <p>No tienes órdenes recientes.</p>
            ) : (
              <>
                <div className="ordenes-lista">
                  {/* Iteramos sobre las órdenes de la paginación */}
                  {ordenesActuales.map((orden) => (
                    // Cada orden ahora es un grupo de productos
                    <div className="orden-grupo" key={orden.id_orden}>
                      <div className="orden-info">
                        <strong>Orden #{orden.id_orden}</strong>
                        {/* */}
                        <span className={`estado ${orden.estado}`}>{orden.estado}</span>
                        <p>Fecha: {new Date(orden.fecha_orden).toLocaleDateString()}</p>
                      </div>

                      {/* Iteramos sobre los productos DENTRO de la orden */}
                      {orden.productos.map(producto => (
                        <div className="orden-item" key={producto.id_producto}>
                          <img
                            className="orden-img"
                            src={producto.imagen_url || 'https://via.placeholder.com/150'}
                            alt={producto.nombre}
                          />
                          {/* */}
                          <div>
                            <h3>{producto.nombre}</h3>
                            <p>Cantidad: {producto.orden_producto.cantidad}</p>
                            <p>Subtotal: S/ {Number(producto.orden_producto.subtotal).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                        <button className="orden-butt" onClick={() => navigate("/OrderDetail/" + orden.id_orden)}>
                         Ver detalle de la orden
                        </button>
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
                  <button onClick={paginaSiguiente} disabled={paginaActual === totalPaginas}>
                    {">"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Sesion;