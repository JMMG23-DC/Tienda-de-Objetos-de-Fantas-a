import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const pageSize = 8;

  // --- 1. CARGAR PRODUCTOS DEL BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://3.131.85.192:3000/products");
        if (!response.ok) throw new Error("Error al cargar productos");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- 2. ACTIVAR / DESACTIVAR (Conectado a BD) ---
  const toggleProductStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://3.131.85.192:3000/products/${id}/toggle`, {
        method: "PUT"
      });
      
      if (response.ok) {
        // Actualizar localmente
        setProducts(products.map(p => 
          p.id_producto === id ? { ...p, activo: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // --- 3. FILTRADO ---
  const filtered = []; 
  const filterText = filter.toLowerCase(); 

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    
    // Usamos los nombres de campos reales de tu BD (id_producto, nombre, categoria de la relación)
    const idString = String(p.id_producto);
    const nombreString = p.nombre ? p.nombre.toLowerCase() : "";
    const categoriaString = p.categoria ? p.categoria.nombre?.toLowerCase() : "";

    const idCoincide = idString.indexOf(filterText) !== -1;
    const nombreCoincide = nombreString.indexOf(filterText) !== -1;
    const categoriaCoincide = categoriaString.indexOf(filterText) !== -1;
    
    if (idCoincide || nombreCoincide || categoriaCoincide) {
      filtered.push(p);
    }
  }

  // --- 4. PAGINACIÓN ---
  const totalProducts = filtered.length;
  const totalPages = Math.ceil(totalProducts / pageSize) || 1; 
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = []; 

  for (let i = startIndex; i < endIndex; i++) {
    if (i < totalProducts) {
        paginated.push(filtered[i]);
    }
  }

  return (
    <>

      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ margin: 0, color: "#333" }}>Lista de Productos</h2>
            <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => navigate("/AdminDashboard")} style={{ padding: "8px 15px", cursor: "pointer" }}>Volver al Admin</button>
            </div>
        </div>
        
        {/* CAMPO DE FILTRO */}
        <input
          type="text"
          placeholder="Filtrar por ID, nombre o categoría"
          value={filter}
          onChange={e => { 
              setFilter(e.target.value); 
              setPage(1); 
          }}
          style={{ marginBottom: "1rem", width: "100%", padding: "10px", boxSizing: "border-box" }}
        />
        
        <button style={{ marginBottom: "1rem", padding: "10px", cursor: "pointer", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }} onClick={() => navigate("/NewProduct")}>
            Registrar nuevo producto
        </button>

        {loading ? (
            <p style={{textAlign: 'center'}}>Cargando productos...</p>
        ) : (
            <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Nombre</th>
                    <th style={{ padding: "10px" }}>Categoría</th>
                    <th style={{ padding: "10px" }}>Estado</th>
                    <th style={{ padding: "10px" }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginated.map(p => (
                    <tr key={p.id_producto} style={{ background: p.activo ? "#fff" : "#fff5f5", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{p.id_producto}</td>
                    <td style={{ padding: "10px" }}>{p.nombre}</td>
                    <td style={{ padding: "10px" }}>{p.categoria?.nombre || "Sin categoría"}</td>
                    <td style={{ padding: "10px", fontWeight: "bold", color: p.activo ? "green" : "red" }}>
                        {p.activo ? "Activo" : "Desactivado"}
                    </td>
                    <td style={{ padding: "10px" }}>
                        <button 
                            onClick={() => navigate("/ProductDetail/"+p.id_producto)} 
                            style={{ marginRight: "0.5rem", cursor: "pointer", padding: "5px 10px" }}
                        >
                            Ver detalle
                        </button>
                        
                        {p.activo ? (
                        <button 
                            style={{ background: "#dc3545", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }} 
                            onClick={() => toggleProductStatus(p.id_producto, true)}
                        >
                                Desactivar
                            </button>
                        ) : (
                        <button 
                            style={{ background: "#28a745", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }} 
                            onClick={() => toggleProductStatus(p.id_producto, false)}
                        >
                                Activar
                            </button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center" }}>
                <button 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                    style={{ padding: "5px 10px", cursor: page === 1 ? "not-allowed" : "pointer" }}
                >
                    Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)}
                    style={{ padding: "5px 10px", cursor: page === totalPages ? "not-allowed" : "pointer" }}
                >
                    Siguiente
                </button>
            </div>
            </>
        )}
      </div>
    </>
  );
}
