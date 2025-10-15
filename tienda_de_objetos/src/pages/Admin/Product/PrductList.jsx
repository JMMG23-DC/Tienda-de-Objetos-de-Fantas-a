import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulación de productos
const mockProducts = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto${i + 1}`,
  categoria: `Categoría${(i % 5) + 1}`,
  activo: true,
}));

export default function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(mockProducts);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;


  // FUNCIONES SIMPLIFICADAS DE ACTIVACIÓN/DESACTIVACIÓN

  function handleDeactivate(id) {
    // Recorre el array y cambia 'activo' a false solo en el producto que coincide con el ID.
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        // Si coincide, retorna una copia del producto con 'activo' en falso.
        return { ...p, activo: false }; 
      }
      // Si no coincide, retorna el producto sin cambios.
      return p;
    });
    setProducts(updatedProducts);
  }
  
  function handleActivate(id) {
    // Recorre el array y cambia 'activo' a true solo en el producto que coincide con el ID.
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return { ...p, activo: true }; 
      }
      return p;
    });
    setProducts(updatedProducts);
  }


  // FILTRADO
  // Array donde almacenaremos los productos que coincidan con el filtro.
  const filtered = []; 
  const filterText = filter; 

  // Recorremos la lista completa de productos uno por uno.
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    
    // Convertimos el ID a cadena para poder buscar texto dentro de él.
    const idString = String(p.id);

    // Utilizamos search() para verificar si el texto del filtro se encuentra 
    // en el ID, nombre o categoría. search() devuelve -1 si NO se encuentra.
    const idCoincide = idString.search(filterText) !== -1;
    const nombreCoincide = p.nombre.search(filterText) !== -1;
    const categoriaCoincide = p.categoria.search(filterText) !== -1;
    
    // Si cualquiera de las condiciones es verdadera, agregamos el producto a la lista.
    if (idCoincide || nombreCoincide || categoriaCoincide) {
      filtered.push(p);
    }
  }
// -------------------------------------------------------------------
// PAGINACIÓN 
  const totalProducts = filtered.length;
  // Math.ceil asegura que siempre tengamos una página para el último grupo de productos.
  const totalPages = Math.ceil(totalProducts / pageSize); 
  
  // Calculamos el índice de inicio y fin para la página actual.
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Creamos un nuevo array para los productos de la página actual.
  const paginated = []; 

  // Recorremos la lista filtrada solo en el rango de índices que nos interesa.
  for (let i = startIndex; i < endIndex; i++) {
    // Si el índice es válido (no se ha excedido el total de productos), lo agregamos.
    if (i < totalProducts) {
        paginated.push(filtered[i]);
    }
  }
// -------------------------------------------------------------------


  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Lista de Productos</h2>
      
      {/* --- CAMPO DE FILTRO --- */}
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o categoría"
        value={filter}
        onChange={e => { 
            setFilter(e.target.value); 
            setPage(1); // Siempre vuelve a la primera página al filtrar
        }}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      
      {/* --- BOTONES --- */}
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/NewProduct")}>
          Registrar nuevo producto
      </button>
      <button type="button" style={{ marginLeft: "1rem" }} onClick={() => navigate("/AdminDashboard")}>
          Admin
      </button>

      {/* --- TABLA DE PRODUCTOS --- */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(p => (
            <tr key={p.id} style={{ background: p.activo ? "#fff" : "#fee" }}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{p.activo ? "Activo" : "Desactivado"}</td>
              <td>
                <button onClick={() => navigate("/ProductDetail/"+p.id)} style={{ marginRight: "0.5rem" }}>
                    Ver detalle
                </button>
                {p.activo ? (
                  <button style={{ background: "#c00", color: "#fff" }} onClick={() => handleDeactivate(p.id)}>
                        Desactivar
                    </button>
                ) : (
                  <button style={{ background: "#080", color: "#fff" }} onClick={() => handleActivate(p.id)}>
                        Activar
                    </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* --- CONTROLES DE PAGINACIÓN --- */}
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