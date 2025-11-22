import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("ERROR FRONT:", err));
  }, []);

  // FILTRO
  const filtradas = categories.filter(c =>
    c.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    (c.descripcion?.toLowerCase().includes(filter.toLowerCase()))
  );

  // PAGINACIÓN
  const totalPages = Math.ceil(filtradas.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const paginatedCategories = filtradas.slice(startIndex, endIndex);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0002"
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>Lista de Categorías</h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Filtrar por nombre o descripción..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "1.5rem",
          border: "1px solid #ccc",
          borderRadius: 4
        }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <button style={{ marginRight: 10 }} onClick={() => navigate("/NewCategory")}>
          Registrar nueva Categoría
        </button>
        <button onClick={() => navigate("/AdminDashboard")}>
          Admin Dashboard
        </button>
      </div>

      {/* TABLA */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
            <th style={{ padding: 10 }}>#</th>
            <th style={{ padding: 10 }}>Categoría</th>
            <th style={{ padding: 10 }}>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((cat, index) => {
            const globalIndex = (page - 1) * pageSize + index + 1;
            return (
              <tr key={cat.nombre} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{globalIndex}</td>
                <td style={{ padding: 10 }}>{cat.nombre}</td>
                <td style={{ padding: 10 }}>{cat.descripcion || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: 10 }}
        >
          Anterior
        </button>

        <span style={{ margin: "0 1rem" }}>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
