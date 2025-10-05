
import { useState } from "react";

export default function ProductDetail({ product, onBack, onSave }) {
  const [nombre, setNombre] = useState(product?.nombre || "");
  const [categoria, setCategoria] = useState(product?.categoria || "");
  const [precio, setPrecio] = useState(product?.precio || "");
  const [activo, setActivo] = useState(product?.activo ?? true);
  const [imagen, setImagen] = useState(product?.imagen || null);
  const [error, setError] = useState("");

  if (!product) return <div>No se encontró el producto.</div>;

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !categoria || !precio) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    // Simulación de guardado
    if (onSave) onSave({ ...product, nombre, categoria, precio, activo, imagen });
  }

  function handleImage(e) {
    setImagen(e.target.files[0]);
  }

  return (
    <div className="product-detail" style={{ padding: "2rem", maxWidth: 400, margin: "2rem auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>Volver</button>
      <h2>Detalle de producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label><br />
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required /><br />
        <label>Categoría:</label><br />
        <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} required /><br />
        <label>Precio:</label><br />
        <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} required min={1} /><br />
        <label>Estado:</label><br />
        <select value={activo ? "activo" : "desactivado"} onChange={e => setActivo(e.target.value === "activo")}> 
          <option value="activo">Activo</option>
          <option value="desactivado">Desactivado</option>
        </select><br />
        <label>Imagen:</label><br />
        <input type="file" accept="image/*" onChange={handleImage} /><br />
        {imagen && typeof imagen === "object" && <div style={{ marginTop: "1rem" }}><img src={URL.createObjectURL(imagen)} alt="preview" style={{ maxWidth: "100%", maxHeight: 120 }} /></div>}
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        <button type="submit" style={{ marginTop: "1rem" }}>Guardar cambios</button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <b>ID:</b> {product.id}
      </div>
    </div>
  );
}
