import { useState, useEffect } from "react";
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
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [error, setError] = useState("");

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
  function handleImage(e) {
    const file = e.target.files[0];
    setImagen(file); 
  }


  function toggleProducto(producto) {
    setProductosSeleccionados(prev => {
      // Usamos 'find' para verificar si el producto ya está en la lista.
      const yaSeleccionado = prev.find(p => p.id === producto.id);
      
      if (yaSeleccionado) {
        // Si está, usamos 'filter' para crear una nueva lista sin él (Eliminar).
        return prev.filter(p => p.id !== producto.id); 
      } else {
        // Si no está, usamos el operador spread (...) para agregarlo (Agregar).
        return [...prev, producto]; 
      }
    });
  }
// -------------------------------------------------------------------

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
      <h3>Registrar Nueva Categoría</h3>
      
      {/* --- FORMULARIO --- */}
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

        
        <label>Imagen de la Categoría:</label><br />
        <input 
            type="file" 
            accept="image/*" 
            onChange={handleImage} 
            style={{ marginBottom: "1rem" }}
        /><br />
        
        {/* Eliminamos el bloque de previsualización */}

        {/* Selector de Productos */}
        <label style={{ marginTop: "1rem", display: "block" }}>Productos a Agregar:</label>
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem", borderRadius: 4, marginBottom: "1rem" }}>
          {mockProducts.map(p => (
            <div key={p.id}>
              <input
                type="checkbox"
                checked={!!productosSeleccionados.find(prod => prod.id === p.id)} 
                onChange={() => toggleProducto(p)}
              />
              <span style={{ marginLeft: "5px" }}>{p.nombre}</span>
            </div>
          ))}
        </div>

        {/* Mensaje de Error */}
        {error && <div style={{ color: "red", marginTop: "1rem", fontWeight: "bold" }}>{error}</div>}

        {/* Botones de Acción */}
        <button type="submit" style={{ marginTop: "1rem", padding: "10px 15px" }}>
            Guardar Categoría
        </button>
        <button
          type="button"
          style={{ marginLeft: "1rem", padding: "10px 15px" }}
          onClick={() => navigate("/CategoryList")}
        >
          Cancelar
        </button>
        <button
          type="button"
          style={{ marginLeft: "1rem", padding: "10px 15px" }}
          onClick={() => navigate("/AdminDashboard")}
        >
          Admin
        </button>
      </form>
      
      {/* --- LISTA DE PRODUCTOS SELECCIONADOS --- */}
      {productosSeleccionados.length > 0 && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
          <b>Productos Seleccionados:</b>
          <ul>
            {productosSeleccionados.map(p => <li key={p.id}>{p.nombre}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}