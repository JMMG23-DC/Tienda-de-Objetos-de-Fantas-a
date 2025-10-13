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
  const pageSize = 5; // menor cantidad por página para categorías

  // Obtener categorías únicas
  const categories = Array.from(
    new Set(
      products
        .filter(p => p.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                     p.categoria.toLowerCase().includes(filter.toLowerCase()))
        .map(p => p.categoria)
    )
  );

  const totalPages = Math.ceil(categories.length / pageSize);
  const paginated = categories.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Lista de categorías</h2>
      <input
        type="text"
        placeholder="Filtrar por categoría"
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      
      <button type="button" style={{ marginBottom: "1rem" }} onClick={() => navigate("/NewCategory")}>Registrar nueva Categoria</button> {" "} 
      <button type="button" style={{ marginBottom: "1rem" }} onClick={() => navigate("/AdminDashboard")}>Admin</button>

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
          {paginated.map((cat, index) => {
            // Contar productos activos y totales en esta categoría
            const prods = products.filter(p => p.categoria === cat);
            const activos = prods.filter(p => p.activo).length;
            return (
              <tr key={cat} style={{ background: activos > 0 ? "#fff" : "#fee" }}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{cat}</td>
                <td>{`${activos}/${prods.length}`}</td>
                <td>
                  <button onClick={() => navigate(`/CategoryDetail/${index}`)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}
