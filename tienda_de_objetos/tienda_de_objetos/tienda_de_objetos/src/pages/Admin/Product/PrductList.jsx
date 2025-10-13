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

  function handleDeactivate(id) {
    setProducts(products.map(p => p.id === id ? { ...p, activo: false } : p));
  }
  function handleActivate(id) {
    setProducts(products.map(p => p.id === id ? { ...p, activo: true } : p));
  }

  const filtered = products.filter(p =>
    p.id.toString().includes(filter) ||
    p.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filter.toLowerCase())
  );

  
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Lista de productos</h2>
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o categoría"
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/NewProduct")}>Registrar nuevo producto</button>
      <button type="button" style={{ marginLeft: "1rem" }} onClick={() => navigate("/AdminDashboard")}>Admin</button>
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
                <button onClick={() => navigate("/ProductDetail/"+p.id)} style={{ marginRight: "0.5rem" }}>Ver detalle</button>
                {p.activo ? (
                  <button style={{ background: "#c00", color: "#fff" }} onClick={() => handleDeactivate(p.id)}>Desactivar</button>
                ) : (
                  <button style={{ background: "#080", color: "#fff" }} onClick={() => handleActivate(p.id)}>Activar</button>
                )}
              </td>
            </tr>
          ))}
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
