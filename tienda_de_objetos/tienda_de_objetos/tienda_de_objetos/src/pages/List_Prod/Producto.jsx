import { useState, useEffect } from "react";
import { imagesData } from "../../data/imagesData";
import "../List_Prod/producto.css"; 
import { TopBar } from "../Home/components/TopBar"
import { Footer } from "../Home/components/Footer"
import { Link, useParams } from "react-router-dom";


// Clave del localStorage para el carrito
const LOCAL_STORAGE_KEY = "cart"; 

export const Producto = () => {

  const { nombre } = useParams()

  // Estado para la vista previa del carrito
  const [carritoPreview, setCarritoPreview] = useState([]);

  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [rarezaFiltro, setRarezaFiltro] = useState("Todas");
  const [ordenPrecio, setOrdenPrecio] = useState("asc");
  const [pagina, setPagina] = useState(1);
  

  const productosPorPagina = 6;

  // Filtrar productos
  const productosFiltrados = imagesData
    .filter(producto => (categoriaFiltro === "Todas" ? true : producto.categoria === categoriaFiltro))
    .filter(producto => (rarezaFiltro === "Todas" ? true : producto.rareza === rarezaFiltro))
    .sort((a, b) => ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio);

  // Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * productosPorPagina,
    pagina * productosPorPagina
  );

  // Función de utilidad para cargar el carrito de localStorage
  const loadCartFromStorage = () => {
    try {
        const carritoActual = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        return carritoActual;
    } catch (error) {
        console.error("Error al cargar el carrito de localStorage:", error);
        return [];
    }
  };

  // Cargar el carrito al montar el componente para inicializar la vista previa
  useEffect(() => {
    setCarritoPreview(loadCartFromStorage());
  }, []); 

  
  // Función para actualizar el carrito (incremento, decremento o adición)
  const updateCart = (productoId, operacion, productoInfo) => {
    const carritoActual = loadCartFromStorage();
    let nuevoCarrito;

    const indiceExistente = carritoActual.findIndex((item) => item.id === productoId);

    if (indiceExistente !== -1) {
      //Producto existente (aumentar o disminuir)
      nuevoCarrito = carritoActual.map((item, index) => {
        if (index === indiceExistente) {
          const nuevaCantidad = operacion === 'add' ? item.cantidad + 1 : item.cantidad - 1;
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      });
      
      // Filtramos para eliminar productos con cantidad <= 0
      nuevoCarrito = nuevoCarrito.filter(item => item.cantidad > 0);

    } else if (operacion === 'add' && productoInfo) {
      // Producto nuevo (viene desde el catálogo)
      const itemNuevo = {
        id: productoInfo.id,
        nombre: productoInfo.nombre,
        precio: productoInfo.precio,
        imagen: productoInfo.imagen,
        cantidad: 1, // Cantidad inicial 1
        guardado: false, 
      };
      nuevoCarrito = [...carritoActual, itemNuevo];
    } else {
      // No hay cambios si no hay producto y no es adición
      return; 
    }
    
    // Guardar el nuevo carrito en localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nuevoCarrito));

    // Actualizar el estado de la vista previa para re-renderizar
    setCarritoPreview(nuevoCarrito); 
  };


  const agregarAlCarrito = (productoNuevo) => {
      updateCart(productoNuevo.id, 'add', productoNuevo);
  };

  const handleIncrease = (id) => updateCart(id, 'add');
  const handleDecrease = (id) => updateCart(id, 'subtract');


  return (
    <>
      <TopBar/>
      <div className="catalogo">
        <h1 className="catalogo-title">Catálogo de Productos</h1>

        {/* CONTENEDOR PRINCIPAL CON FLEXBOX */}
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
                  {[...new Set(imagesData.map(p => p.categoria))].map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Rareza:</label>
                <select onChange={e => setRarezaFiltro(e.target.value)} value={rarezaFiltro}>
                  <option value="Todas">Todas</option>
                  {[...new Set(imagesData.map(p => p.rareza))].map((r, idx) => (
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
            
            <hr/>

            {/* 2. VISTA PREVIA DEL CARRITO */}
            <div className="preview-container">
              <h2>
                Carrito ({carritoPreview.length} items)
              </h2>
              {carritoPreview.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999', padding: '10px 0' }}>Aún no hay productos.</p>
              ) : (
                  <ul className="preview-list">
                      {carritoPreview.map((item) => (
                          <li key={item.id} className="preview-item">
                              
                              {/* Nombre y Precio */}
                              <div style={{ flex: 2 }}>
                                  <span style={{ fontWeight: '600', fontSize: '0.9em' }}>{item.nombre}</span>
                                  <p style={{ margin: '0', fontSize: '0.8em', color: '#ff5500' }}>
                                    S/. {(item.precio * item.cantidad).toFixed(2)}
                                  </p>
                              </div>

                              {/* Controles de Cantidad */} 
                              <div className="controls-container">
                                  <button onClick={() => handleDecrease(item.id)} className="control-btn">
                                      -
                                  </button>
                                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                                      {item.cantidad}
                                  </span>
                                  <button onClick={() => handleIncrease(item.id)} className="control-btn">
                                      +
                                  </button>
                              </div>
                          </li>
                      ))}
                      <li className="preview-total">
                          <span>Total General:</span>
                          <span style={{ color: '#E91E63' }}>
                              S/. {carritoPreview.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}
                          </span>
                      </li>
                  </ul>
              )}
              
              {/* Enlace al carrito */}
              <Link 
                to="/Car" 
                className="link-to-car primary-btn"
              >
                Ver/Finalizar Compra
              </Link>

            </div>
          </div>

          {/* COLUMNA DERECHA: PRODUCTOS Y PAGINACIÓN */}
          <div className="catalogo-productos">
            
            {/* SECCIÓN PRINCIPAL DE PRODUCTOS (GRID) */}
            {productosPagina.map((producto) => (
              <div key={producto.id} className="producto-card">
                <img src={producto.imagen} alt={producto.nombre} />
                <div style={{ padding: '15px' }}>
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-desc">{producto.descripcion}</p>
                  <p className="producto-rareza">Rareza: {producto.rareza}</p>
                  <span className="producto-precio">S/. {producto.precio.toFixed(2)}</span>
                  <button type="button" onClick={() => agregarAlCarrito(producto)} className="primary-btn"> 
                    + Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}

            <div className="catalogo-paginacion" style={{ gridColumn: '1 / -1' }}> 
              {/* gridColumn: '1 / -1' asegura que la paginación ocupe todo el ancho bajo el grid */}
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={pagina === i + 1 ? "pagina-active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>    
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default Producto;