import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();

  const fetchCategories = () => {
    fetch("http://3.131.85.192:3000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("ERROR FRONT:", err));
  };

  useEffect(() => { fetchCategories(); }, []);

  // EDITAR CATEGORÍA
  const editCategory = async (cat) => {
    const nuevoNombre = prompt("Nuevo nombre de categoría:", cat.categoria);
    if (!nuevoNombre) return;

    const nuevaDesc = prompt("Nueva descripción:", cat.descripcion_categoria || "");
    if (nuevaDesc === null) return;

    try {
      const res = await fetch("http://3.131.85.192:3000/categories/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria: cat.categoria, // nombre original de la categoría
          nuevoNombre,
          nuevaDesc
        })
      });

      if (res.ok) {
        alert("Categoría actualizada correctamente");
        fetchCategories(); // recargar datos
      } else {
        const err = await res.json();
        alert("Error al actualizar: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la categoría");
    }
  };

  // FILTRO
  const filtradas = categories.filter(c =>
    c.categoria.toLowerCase().includes(filter.toLowerCase()) ||
    (c.descripcion_categoria?.toLowerCase().includes(filter.toLowerCase()))
  );

  // PAGINACIÓN
  const totalPages = Math.ceil(filtradas.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedCategories = filtradas.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Lista de Categorías</h2>

      <input
        type="text"
        placeholder="Filtrar por nombre o descripción..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        style={{ width: "100%", padding: "8px", marginBottom: "1.5rem", border: "1px solid #ccc", borderRadius: 4 }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <button style={{ marginRight: 10 }} onClick={() => navigate("/NewCategory")}>Registrar nueva Categoría</button>
        <button onClick={() => navigate("/AdminDashboard")}>Admin Dashboard</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
            <th style={{ padding: 10 }}>#</th>
            <th style={{ padding: 10 }}>Categoría</th>
            <th style={{ padding: 10 }}>Descripción</th>
            <th style={{ padding: 10 }}>Editar</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((cat, index) => {
            const globalIndex = (page - 1) * pageSize + index + 1;
            return (
              <tr key={cat.categoria} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{globalIndex}</td>
                <td style={{ padding: 10 }}>{cat.categoria}</td>
                <td style={{ padding: 10 }}>{cat.descripcion_categoria || "—"}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => editCategory(cat)}>Editar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ marginRight: 10 }}>Anterior</button>
        <span style={{ margin: "0 1rem" }}>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}
