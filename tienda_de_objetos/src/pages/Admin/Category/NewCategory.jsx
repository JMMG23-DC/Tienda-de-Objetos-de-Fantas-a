import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewCategory() {
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [productos, setProductos] = useState([]); // Productos del backend
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [error, setError] = useState("");

  // Cargar productos del backend
  useEffect(() => {
    fetch("http://3.131.85.192:3000/products") // Endpoint real de productos
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  // Seleccionar / deseleccionar producto
  const toggleProducto = (producto) => {
    setProductosSeleccionados(prev => {
      const yaSeleccionado = prev.find(p => p.id_producto === producto.id_producto);
      if (yaSeleccionado) {
        return prev.filter(p => p.id_producto !== producto.id_producto);
      } else {
        return [...prev, producto];
      }
    });
  };

  // Enviar categoría y actualizar productos
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoria) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    if (productosSeleccionados.length === 0) {
      setError("Debes seleccionar al menos un producto.");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://3.131.85.192:3000/categories/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria,
          descripcion_categoria: descripcion,
          productos: JSON.stringify(productosSeleccionados.map(p => p.id_producto))
        }),
      });

      if (res.ok) {
        alert("Categoría y productos actualizados correctamente");
        navigate("/CategoryList");
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar productos");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Registrar Categoría de Productos</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre de Categoría:</label><br />
        <input
          type="text"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "8px" }}
        /><br />

        <label>Descripción (opcional):</label><br />
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          rows={3}
          style={{ width: "100%", marginBottom: "1rem", padding: "8px" }}
        /><br />

        <label style={{ marginTop: "1rem", display: "block" }}>Selecciona Productos:</label>
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem", borderRadius: 4, marginBottom: "1rem" }}>
          {productos.map(p => (
            <div key={p.id_producto}>
              <input
                type="checkbox"
                checked={!!productosSeleccionados.find(prod => prod.id_producto === p.id_producto)}
                onChange={() => toggleProducto(p)}
              />
              <span style={{ marginLeft: "5px" }}>{p.nombre}</span>
            </div>
          ))}
        </div>

        {error && <div style={{ color: "red", marginTop: "1rem", fontWeight: "bold" }}>{error}</div>}

        <button type="submit" style={{ marginTop: "1rem", padding: "10px 15px" }}>Actualizar Categoría</button>
        <button type="button" style={{ marginLeft: "1rem", padding: "10px 15px" }} onClick={() => navigate("/CategoryList")}>Cancelar</button>
      </form>

      {productosSeleccionados.length > 0 && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
          <b>Productos Seleccionados:</b>
          <ul>
            {productosSeleccionados.map(p => <li key={p.id_producto}>{p.nombre}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
