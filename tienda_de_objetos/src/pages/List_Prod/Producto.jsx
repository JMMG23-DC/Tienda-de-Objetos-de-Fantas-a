import { useState } from "react";
import { imagesData } from "../../data/imagesData";
import "../List_Prod/producto.css";
import { TopBar } from "../Home/components/TopBar"
import { Footer } from "../Home/components/Footer"


export const Producto = () => {
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

  return (
    <>
    <TopBar/>
    <div className="catalogo">
      <h1 className="catalogo-title">Catálogo de Productos</h1>

      <div className="catalogo-body">
        {/* Filtros */}
        <div className="catalogo-filtros">
          <select onChange={e => setCategoriaFiltro(e.target.value)} value={categoriaFiltro}>
            <option value="Todas">Todas las Categorías</option>
            {[...new Set(imagesData.map(p => p.categoria))].map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <select onChange={e => setRarezaFiltro(e.target.value)} value={rarezaFiltro}>
            <option value="Todas">Todas las Rarezas</option>
            {[...new Set(imagesData.map(p => p.rareza))].map((r, idx) => (
              <option key={idx} value={r}>{r}</option>
            ))}
          </select>

          <select onChange={e => setOrdenPrecio(e.target.value)} value={ordenPrecio}>
            <option value="asc">Precio Ascendente</option>
            <option value="desc">Precio Descendente</option>
          </select>
        </div>

        {/* Productos */}
        <div className="catalogo-productos">
          {productosPagina.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <h3 className="producto-nombre">{producto.nombre}</h3>
              <p className="producto-desc">{producto.descripcion}</p>
              <p className="producto-rareza">Rareza: {producto.rareza}</p>
              <span className="producto-precio">S/. {producto.precio}</span>
              <br />
              <button type="button">Agregar al carrito</button>
            </div>
          ))}
        </div>
      </div>

      {/* Paginación */}
      <div className="catalogo-paginacion">
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
    <Footer/>
    </>
  );
};

export default Producto;
