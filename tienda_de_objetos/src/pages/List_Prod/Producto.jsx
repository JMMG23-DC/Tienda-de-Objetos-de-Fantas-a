import { useState, useEffect } from "react";
import { imagesData } from "../../data/imagesData";
import "../List_Prod/producto.css"; 
import { TopBar } from "../Home/components/TopBar";
import { Footer } from "../Home/components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom"; 

export const Producto = () => {
  // Hook para navegación (cambiar de página)
  const navigate = useNavigate();

  // 1. ESTADOS PRINCIPALES: Almacenan la información y la interacción del usuario
  const [carritoEnStorage, setCarritoEnStorage] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [rarezaFiltro, setRarezaFiltro] = useState("Todas");
  const [ordenPrecio, setOrdenPrecio] = useState("asc");
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 6;

  // 2. EFECTO DE MONTAJE: Carga inicial del carrito desde el navegador
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("cart");
    if (carritoGuardado) {
      // Carga el carrito si existe
      const carritoParsed = JSON.parse(carritoGuardado);
      setCarritoEnStorage(carritoParsed);
    } else {
      // Si no hay nada, inicia vacío
      setCarritoEnStorage([]);
    }
  }, []); 

  // 3. LÓGICA DEL CARRITO: Usa for/push para actualizar el estado del carrito
  const actualizarCarritoEnLocalStorage = (productoId, operacion, productoInfo) => {
    // Lee del localStorage (típico enfoque inicial)
    const carritoActualJSON = localStorage.getItem("cart");
    const carritoActual = carritoActualJSON ? JSON.parse(carritoActualJSON) : [];

    let nuevoEstadoDelCarrito = [];
    let productoYaExistente = false;

    // Bucle FOR: Recorre el carrito para encontrar/actualizar el producto
    for (let i = 0; i < carritoActual.length; i++) {
      let item = carritoActual[i];

      if (item.id === productoId) {
        productoYaExistente = true;
        let nuevaCantidad = operacion === 'add' ? item.cantidad + 1 : item.cantidad - 1;

        // Si la cantidad es > 0, lo mantiene en el carrito
        if (nuevaCantidad > 0) {
          nuevoEstadoDelCarrito.push({ ...item, cantidad: nuevaCantidad });
        }
      } else {
        // Mantiene los otros productos
        nuevoEstadoDelCarrito.push(item);
      }
    }

    // Si es un producto nuevo, lo agrega
    if (!productoYaExistente && operacion === 'add' && productoInfo) {
      nuevoEstadoDelCarrito.push({ ...productoInfo, cantidad: 1, guardado: false });
    }

    // Guarda y actualiza el estado de React
    localStorage.setItem("cart", JSON.stringify(nuevoEstadoDelCarrito));
    setCarritoEnStorage(nuevoEstadoDelCarrito);
  };

  // Funciones de acceso rápido
  const agregarAlCarrito = (productoNuevo) => actualizarCarritoEnLocalStorage(productoNuevo.id, 'add', productoNuevo);
  const handleIncrease = (id) => actualizarCarritoEnLocalStorage(id, 'add');
  const handleDecrease = (id) => actualizarCarritoEnLocalStorage(id, 'subtract');

  // 4. FILTRADO Y ORDENAMIENTO DE PRODUCTOS: Usa filter() y sort()
  const productosFiltrados = imagesData
    .filter(producto => (categoriaFiltro === "Todas" ? true : producto.categoria === categoriaFiltro))
    .filter(producto => (rarezaFiltro === "Todas" ? true : producto.rareza === rarezaFiltro))
    .sort((a, b) => ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio);

  // 5. LÓGICA DE PAGINACIÓN: Calcula páginas y recorta el array con slice()
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // 6. OBTENER OPCIONES ÚNICAS (sin Set): Usa map() y filter() con indexOf()
  
  // Categorías: obtiene todas, luego filtra dejando solo la primera aparición
  const todasLasCategorias = imagesData.map(p => p.categoria);
  const categoriasUnicas = todasLasCategorias.filter((categoria, index) => {
      return todasLasCategorias.indexOf(categoria) === index;
  });
  
  // Rarezas: el mismo patrón para obtener valores únicos
  const todasLasRarezas = imagesData.map(p => p.rareza);
  const rarezaUnicas = todasLasRarezas.filter((rareza, index) => {
      return todasLasRarezas.indexOf(rareza) === index;
  });


  return (
    <>
      <TopBar />
      <div className="catalogo">
        <h1 className="catalogo-title">Catálogo de Productos</h1>

        <div className="catalogo-body">

          {/* COLUMNA IZQUIERDA: FILTROS y VISTA PREVIA DEL CARRITO */}
          <div className="sidebar">

            {/* 1. SECCIÓN DE FILTROS Y ORDENAMIENTO */}
            <div className="filters-container">
              <h3>Opciones de Filtrado</h3>

              <div className="filter-group">
                <label>Categoría:</label>
                <select onChange={e => setCategoriaFiltro(e.target.value)} value={categoriaFiltro}>
                  <option value="Todas">Todas</option>
                  {/* Mapea las categorías únicas obtenidas */}
                  {categoriasUnicas.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Rareza:</label>
                <select onChange={e => setRarezaFiltro(e.target.value)} value={rarezaFiltro}>
                  <option value="Todas">Todas</option>
                  {/* Mapea las rarezas únicas obtenidas */}
                  {rarezaUnicas.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Precio:</label>
                <select onChange={e => setOrdenPrecio(e.target.value)} value={ordenPrecio}>
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>

            </div>

            <hr />

            {/* 2. VISTA PREVIA DEL CARRITO */}
            <div className="preview-container">
              <h2>
                Carrito ({carritoEnStorage.length} items)
              </h2>
              {carritoEnStorage.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '10px 0' }}>Aún no hay productos.</p>
              ) : (
                <ul className="preview-list">
                  {carritoEnStorage.map((item) => (
                    <li key={item.id} className="preview-item">

                      <div style={{ flex: 2 }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9em' }}>{item.nombre}</span>
                        <p style={{ margin: '0', fontSize: '0.8em', color: '#ff5500' }}>
                          S/. {(item.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>

                      {/* Controles de Cantidad */}
                      <div className="controls-container">
                        <button onClick={() => handleDecrease(item.id)} className="control-btn">-</button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                          {item.cantidad}
                        </span>
                        <button onClick={() => handleIncrease(item.id)} className="control-btn">+</button>
                      </div>
                    </li>
                  ))}
                  <li className="preview-total">
                    <span>Total General:</span>
                    <span style={{ color: '#E91E63' }}>
                      S/. {carritoEnStorage.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}
                    </span>
                  </li>
                </ul>
              )}

              <Link to="/Car" className="link-to-car primary-btn">
                Ir a Carrito
              </Link>

            </div>
          </div>

          {/* COLUMNA DERECHA: PRODUCTOS Y PAGINACIÓN */}
          <div className="catalogo-productos">

            {/* Mapea los productos de la página actual */}
            {productosPagina.map((producto) => (
              <div key={producto.id} className="producto-card">
                <img src={producto.imagen} alt={producto.nombre} />
                <div style={{ padding: '15px' }}>
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-rareza">Rareza: {producto.rareza}</p>
                  <span className="producto-precio">S/. {producto.precio.toFixed(2)}</span>
                  <button type="button" onClick={() => agregarAlCarrito(producto)} className="primary-btn">
                    + Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}

            <div className="catalogo-paginacion" style={{ gridColumn: '1 / -1' }}>
              {/* Generación de botones de paginación usando Array.from */}
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