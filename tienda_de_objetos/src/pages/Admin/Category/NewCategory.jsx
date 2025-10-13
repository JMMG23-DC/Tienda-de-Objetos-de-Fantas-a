import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulación de productos existentes
const mockProducts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto${i + 1}`,
}));

export default function NewCategory({ onSave }) {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [error, setError] = useState("");

  // Guardar categoría
  function handleSubmit(e) {
    e.preventDefault();
    if (!categoria) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    setError("");
    onSave({ categoria, descripcion, imagen, productos: productosSeleccionados });
    navigate("/CategoryList");
  }

  // Manejar imagen
  function handleImage(e) {
    const file = e.target.files[0];
    setImagen(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  // Manejar selección de productos
  function toggleProducto(producto) {
    setProductosSeleccionados(prev => {
      if (prev.find(p => p.id === producto.id)) {
        return prev.filter(p => p.id !== producto.id); // eliminar
      } else {
        return [...prev, producto]; // agregar
      }
    });
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0002",
      }}
    >
      <h3>Registrar nueva categoría</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre de categoría:</label><br />
        <input
          type="text"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          required
        /><br />

        <label>Descripción (opcional):</label><br />
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          rows={3}
        /><br />

        <label>Imagen de la categoría:</label><br />
        <input type="file" accept="image/*" onChange={handleImage} /><br />
        {previewUrl && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={previewUrl}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: 120 }}
            />
          </div>
        )}

        <label style={{ marginTop: "1rem" }}>Productos a agregar:</label>
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem", borderRadius: 4 }}>
          {mockProducts.map(p => (
            <div key={p.id}>
              <input
                type="checkbox"
                checked={!!productosSeleccionados.find(prod => prod.id === p.id)}
                onChange={() => toggleProducto(p)}
              />
              <span style={{ marginLeft: 0.5 }}>{p.nombre}</span>
            </div>
          ))}
        </div>

        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}

        <button type="submit" style={{ marginTop: "1rem" }}>Guardar categoría</button>
        <button
          type="button"
          style={{ marginLeft: "1rem" }}
          onClick={() => navigate("/CategoryList")}
        >
          Cancelar
        </button>
        <button
          type="button"
          style={{ marginLeft: "1rem" }}
          onClick={() => navigate("/AdminDashboard")}
        >
          Admin
        </button>
      </form>

      {productosSeleccionados.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <b>Productos seleccionados:</b>
          <ul>
            {productosSeleccionados.map(p => <li key={p.id}>{p.nombre}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
