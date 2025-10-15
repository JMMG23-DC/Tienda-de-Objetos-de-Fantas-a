import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProduct({ onSave, onCancel }) {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !categoria || !precio || !imagen) {
      setError("Todos los campos son obligatorios, incluyendo la imagen.");
      return;
    }
    setError("");
    // Simulación de guardado
    onSave({ nombre, categoria, precio, imagen });
  }

  function handleImage(e) {
    setImagen(e.target.files[0]);
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Registrar nuevo producto</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label><br />
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required /><br />
        <label>Categoría:</label><br />
        <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} required /><br />
        <label>Precio:</label><br />
        <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} required min={1} /><br />
        <label>Imagen:</label><br />
        <input type="file" accept="image/*" onChange={handleImage} required /><br />
        {imagen && <div style={{ marginTop: "1rem" }}><img src={URL.createObjectURL(imagen)} alt="preview" style={{ maxWidth: "100%", maxHeight: 120 }} /></div>}
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        <button type="submit" style={{ marginTop: "1rem" }}>Guardar producto</button>
        <button type="button" style={{ marginLeft: "1rem" }} onClick={() => navigate("/ProductList")}>Cancelar</button>
        <button type="button" style={{ marginLeft: "1rem" }} onClick={() => navigate("/AdminDashboard")}>Admin</button>
      </form>
    </div>
  );
}
