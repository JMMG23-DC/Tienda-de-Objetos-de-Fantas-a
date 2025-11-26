import { useState, useEffect } from "react";
import "../List_Prod/producto.css"; 
import { TopBar } from "../Home/components/TopBar";
import { Footer } from "../Home/components/Footer";
import { Link, useNavigate } from "react-router-dom"; 

export const Producto = () => {
  const navigate = useNavigate();

  // -----------------------------
  // 1. ESTADOS
  // -----------------------------
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [carritoEnStorage, setCarritoEnStorage] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [rarezaFiltro, setRarezaFiltro] = useState("Todas");
  const [ordenPrecio, setOrdenPrecio] = useState("asc");
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 6;

  // -----------------------------
  // 2. CARGAR PRODUCTOS DESDE LA BD
  // -----------------------------
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/productos");
        const data = await res.json();

        const productosAdaptados = data.map(item => ({
          id: item.id_producto,
          nombre: item.nombre,
          precio: parseFloat(item.precio),
          imagen: item.imagen_url,
          rareza: item.rareza || "Común",
          categoria: item.categoria || "General",
          descripcion: item.descripcion
        }));

        setListaProductos(productosAdaptados);
        setCargando(false);

      } catch (error) {
        console.error("Error cargando productos:", error);
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  // -----------------------------
  // 3. CARGAR CARRITO DESDE LOCALSTORAGE
  // -----------------------------
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("cart");
    setCarritoEnStorage(carritoGuardado ? JSON.parse(carritoGuardado) : []);
  }, []);

  // -----------------------------
  // 4. LÓGICA DEL CARRITO
  // -----------------------------
  const actualizarCarritoEnLocalStorage = (productoId, operacion, productoInfo = null) => {
    const carritoActual = JSON.parse(localStorage.getItem("cart")) || [];

    let nuevoCarrito = [];
    let existe = false;

    carritoActual.forEach(item => {
      if (item.id === productoId) {
        existe = true;
        const nuevaCantidad = operacion === "add" ? item.cantidad + 1 : item.cantidad - 1;

        if (nuevaCantidad > 0) {
          nuevoCarrito.push({ ...item, cantidad: nuevaCantidad });
        }
      } else {
        nuevoCarrito.push(item);
      }
    });

    if (!existe && operacion === "add" && productoInfo) {
      nuevoCarrito.push({
        ...productoInfo,
        cantidad: 1,
        guardado: false
      });
    }

    localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
    setCarritoEnStorage(nuevoCarrito);
  };

  const agregarAlCarrito = (productoNuevo) =>
    actualizarCarritoEnLocalStorage(productoNuevo.id, "add", productoNuevo);

  const handleIncrease = (id) => actualizarCarritoEnLocalStorage(id, "add");
  const handleDecrease = (id) => actualizarCarritoEnLocalStorage(id, "subtract");

  // -----------------------------
  // 5. FILTROS
  // -----------------------------
  const productosFiltrados = listaProductos
    .filter(producto => categoriaFiltro === "Todas" || producto.categoria === categoriaFiltro)
    .filter(producto => rarezaFiltro === "Todas" || producto.rareza === rarezaFiltro)
    .sort((a, b) => ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio);

  // -----------------------------
  // 6. PAGINACIÓN
  // -----------------------------
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // -----------------------------
  // 7. OPCIONES ÚNICAS (categorías + rarezas)
  // -----------------------------
  const categoriasUnicas = [...new Set(listaProductos.map(p => p.categoria))];
  const rarezasUnicas = [...new Set(listaProductos.map(p => p.rareza))];

  // -----------------------------
  // 8. RENDER
  // -----------------------------
  return (
    <>
      <TopBar />

      <div className="catalogo">
        <h1 className="catalogo-title">Catálogo de Productos</h1>

        <div className="catalogo-body">

          {/* ------------------ SIDEBAR ------------------ */}
          <div className="sidebar">

            {/* FILTROS */}
            <div className="filters-container">
              <h3>Opciones de Filtrado</h3>

              <div className="filter-group">
                <label>Categoría:</label>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                  <option value="Todas">Todas</option>
                  {categoriasUnicas.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Rareza:</label>
                <select
                  value={rarezaFiltro}
                  onChange={(e) => setRarezaFiltro(e.target.value)}
                >
                  <option value="Todas">Todas</option>
                  {rarezasUnicas.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Precio:</label>
                <select
                  value={ordenPrecio}
                  onChange={(e) => setOrdenPrecio(e.target.value)}
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>
            </div>

            <hr />

            {/* ---------- PREVIEW CARRITO ---------- */}
            <div className="preview-container">
              <h2>Carrito ({carritoEnStorage.length} items)</h2>

              {carritoEnStorage.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999" }}>Aún no hay productos.</p>
              ) : (
                <ul className="preview-list">
                  {carritoEnStorage.map((item) => (
                    <li key={item.id} className="preview-item">
                      <div style={{ flex: 2 }}>
                        <span style={{ fontWeight: "600" }}>{item.nombre}</span>
                        <p style={{ margin: "0", color: "#ff5500" }}>
                          S/. {(item.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>

                      <div className="controls-container">
                        <button onClick={() => handleDecrease(item.id)} className="control-btn">-</button>
                        <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "bold" }}>
                          {item.cantidad}
                        </span>
                        <button onClick={() => handleIncrease(item.id)} className="control-btn">+</button>
                      </div>
                    </li>
                  ))}

                  <li className="preview-total">
                    <span>Total General:</span>
                    <span style={{ color: "#E91E63" }}>
                      S/. {carritoEnStorage.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}
                    </span>
                  </li>
                </ul>
              )}

              <Link to="/Car" className="link-to-car primary-btn">Ir a Carrito</Link>
            </div>
          </div>

          {/* ------------------ LISTA DE PRODUCTOS ------------------ */}
          <div className="catalogo-productos">

            {cargando && <p style={{ width: "100%", textAlign: "center" }}>Cargando productos...</p>}

            {!cargando && productosPagina.map((producto) => (
              <div key={producto.id} className="producto-card">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />

                <div style={{ padding: "15px" }}>
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-rareza">Rareza: {producto.rareza}</p>
                  <span className="producto-precio">S/. {producto.precio.toFixed(2)}</span>

                  <button
                    type="button"
                    onClick={() => agregarAlCarrito(producto)}
                    className="primary-btn"
                  >
                    + Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}

            {/* PAGINACIÓN */}
            <div className="catalogo-paginacion" style={{ gridColumn: "1 / -1" }}>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPaginaActual(i + 1)}
                  className={paginaActual === i + 1 ? "pagina-active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Producto;
