import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulación de productos
const mockProducts = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto${i + 1}`,
  categoria: `Categoría${(i % 5) + 1}`,
  activo: true,
}));

export default function CategoryList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5; // Cantidad de categorías por página


  // El filtro se usa directamente (sensible a mayúsculas/minúsculas).
  const filterText = filter; 

  // Filtrar productos que coinciden con el texto de búsqueda.
  const filteredProducts = products.filter(p => {
    // indexOf() devuelve -1 si la subcadena NO se encuentra.
    const nombreCoincide = p.nombre.indexOf(filterText) !== -1;
    const categoriaCoincide = p.categoria.indexOf(filterText) !== -1;

    return nombreCoincide || categoriaCoincide;
  });

  const uniqueCategoriesTracker = {};
  const categories = [];

  for (let i = 0; i < filteredProducts.length; i++) {
    const cat = filteredProducts[i].categoria;
    // Si la categoría aún no se ha agregado al 'tracker', la agregamos a la lista.
    if (!uniqueCategoriesTracker[cat]) {
      uniqueCategoriesTracker[cat] = true; // Marcar como vista
      categories.push(cat);                 // Agregar a la lista final
    }
  }

  const totalCategories = categories.length;
  // Calcular el número total de páginas.
  const totalPages = Math.ceil(totalCategories / pageSize); 

  // Determinar el inicio y fin del slice para la página actual.
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  
  // Obtener solo las categorías para la página actual.
  const paginatedCategories = categories.slice(startIndex, endIndex);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Lista de Categorías</h2>
      <input
        type="text"
        placeholder="Filtrar por nombre o categoría"
        value={filter}
        onChange={e => { 
          setFilter(e.target.value); 
          setPage(1); // Reiniciar la página al cambiar el filtro
        }}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      
      <button type="button" style={{ marginBottom: "1rem", marginRight: "1rem" }} onClick={() => navigate("/NewCategory")}>
        Registrar nueva Categoria
      </button>
      <button type="button" style={{ marginBottom: "1rem" }} onClick={() => navigate("/AdminDashboard")}>
        Admin Dashboard
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>#</th>
            <th>Categoría</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((cat, index) => {
            // Obtener los productos de esta categoría específica
            const prods = products.filter(p => p.categoria === cat);
            // Contar cuántos de esos productos están activos
            const activos = prods.filter(p => p.activo).length;
            
            // Calcular el índice global para la columna #
            const globalIndex = (page - 1) * pageSize + index + 1;
            
            return (
              <tr key={cat} style={{ background: activos > 0 ? "#fff" : "#fee" }}>
                <td>{globalIndex}</td>
                <td>{cat}</td>
                <td>{`${activos}/${prods.length}`}</td>
                <td>
                  {/* CAMBIO AQUÍ: Usamos el nombre de la categoría (cat) en la URL */}
                  <button onClick={() => navigate(`/CategoryDetail/${cat}`)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Controles de paginación */}
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}