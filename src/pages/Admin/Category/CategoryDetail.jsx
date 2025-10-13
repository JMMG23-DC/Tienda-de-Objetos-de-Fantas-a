import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";

// Simulación de productos
const mockProducts = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto${i + 1}`,
  categoria: `Categoría${(i % 5) + 1}`,
  activo: true,
}));

export default function CategoryDetail() {
  const { index } = useParams(); // recibimos el index de la categoría
  const navigate = useNavigate();

  const catIndex = Number(index);
  const categories = Array.from(new Set(mockProducts.map(p => p.categoria)));

  if (catIndex < 0 || catIndex >= categories.length) {
    return <div>No se encontró la categoría.</div>;
  }

  const display = useMemo(() => {
    const categoria = categories[catIndex];
    const productos = mockProducts.filter(p => p.categoria === categoria);
    return { categoria, productos };
  }, [catIndex]);

  return (
    <div style={{
      padding: "2rem",
      maxWidth: 700,
      margin: "2rem auto",
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 8px #0002"
    }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>Volver</button>
      <h2 style={{ textAlign: "center" }}>Detalle de categoría</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
        <p><b>Nombre de categoría:</b> {display.categoria}</p>

        <div style={{ marginTop: "1rem" }}>
          <b>Productos asociados:</b>
          {display.productos.length === 0 ? (
            <p>Sin productos</p>
          ) : (
            <ul>
              {display.productos.map(p => (
                <li key={p.id}>{p.nombre} ({p.activo ? "Activo" : "Desactivado"})</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/CategoryList")} style={{ marginRight: "1rem" }}>
          Lista de categorías
        </button>
        <button onClick={() => navigate("/AdminDashboard")}>Admin</button>
      </div>
    </div>
  );
}
