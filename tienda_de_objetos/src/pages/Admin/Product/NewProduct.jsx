import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");

  function handleImage(e) {
    setImagen(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nombre || !categoria || !precio || !imagen) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("categoria", categoria);
    formData.append("precio", precio);
    formData.append("imagen", imagen);

    try {
      const res = await fetch("http://localhost:3000/productos", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Error al registrar");

      navigate("/ProductList");

    } catch (err) {
      setError("No se pudo registrar el producto");
      console.error("ERROR FRONT:", err);
    }
  }

  return (
    <div style={{ maxWidth: 450, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2 style={{ textAlign: "center" }}>Registrar nuevo producto</h2>

      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input 
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Categoría:</label>
        <input 
          type="text" 
          value={categoria} 
          onChange={e => setCategoria(e.target.value)} 
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Precio:</label>
        <input 
          type="number" 
          value={precio} 
          onChange={e => setPrecio(e.target.value)} 
          required 
          min="1"
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Imagen:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImage} 
          required
          style={{ marginBottom: "1rem" }}
        />

        {imagen && (
          <div style={{ marginBottom: "1rem" }}>
            <p><b>Preview:</b></p>
            <img 
              src={URL.createObjectURL(imagen)} 
              alt="preview" 
              style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }}
            />
          </div>
        )}

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <button type="submit" style={{ padding: "8px 12px" }}>
          Guardar producto
        </button>

        <button 
          type="button" 
          style={{ padding: "8px 12px", marginLeft: "1rem" }} 
          onClick={() => navigate("/ProductList")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
