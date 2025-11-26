import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../Home/components/TopBar";
import "./Sesion.css";

export const Sesion = () => {
  const nombre = localStorage.getItem("nombre");
  const navigate = useNavigate();

  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 5;

  useEffect(() => {
    if (!nombre) {
      navigate("/login");
      return;
    }

    const fetchOrdenes = async () => {
      setLoading(true);

      // 1️⃣ Mostrar datos en caché mientras se actualiza
      const ordenesEnCache = localStorage.getItem(`ordenes_${nombre}`);
      if (ordenesEnCache) {
        setOrdenes(JSON.parse(ordenesEnCache));
      }

      try {
        const response = await fetch(`http://3.131.85.192:3000/mis-ordenes/${nombre}`);
        if (!response.ok) throw new Error("Error al cargar las órdenes");
        const data = await response.json();
        setOrdenes(data);
        localStorage.setItem(`ordenes_${nombre}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error al actualizar órdenes:", error);
        if (!ordenesEnCache) setOrdenes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [nombre, navigate]);

  // 🔹 Ordenar órdenes por estado (Pendiente → Cancelado → Completado)
  const ordenesOrdenadas = [...ordenes].sort((a, b) => {
    const prioridad = { "Pendiente": 0, "Cancelado": 1, "Completado": 2 };
    return (prioridad[a.estado] || 3) - (prioridad[b.estado] || 3);
  });

  // 🔹 Paginación
  const indiceInicial = (paginaActual - 1) * ordenesPorPagina;
  const indiceFinal = indiceInicial + ordenesPorPagina;
  const ordenesActuales = ordenesOrdenadas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.max(1, Math.ceil(ordenesOrdenadas.length / ordenesPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [ordenes]);

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };
  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const cerrar_sesion = () => {
    localStorage.removeItem("nombre");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem(`ordenes_${nombre}`);
    navigate("/");
  };

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
              Cerrar Sesión
            </button>
          </div>

          {/* Panel Derecho */}
          <div className="sesion-ordenes">
            <h2>Mis Órdenes Recientes</h2>

            {ordenes.length === 0 ? (
              <p>No tienes órdenes recientes.</p>
            ) : (
              <>
                <div className="ordenes-lista">
                  {ordenesActuales.map((orden) => (
                    <div className="orden-grupo" key={orden.id_orden}>
                      <div className="orden-info">
                        <strong>Orden #{orden.id_orden}</strong>
                        <span className={`estado ${orden.estado}`}>{orden.estado}</span>
                        <p>Fecha: {new Date(orden.fecha_orden).toLocaleDateString()}</p>
                      </div>

                      {orden.productos.map(producto => (
                        <div className="orden-item" key={producto.id_producto}>
                          <img
                            className="orden-img"
                            src={producto.imagen_url || 'https://via.placeholder.com/150'}
                            alt={producto.nombre}
                          />
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
