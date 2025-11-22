import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar usuarios desde el Backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar estado (Activo/Desactivado)
  const toggleEstado = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}/toggle`, {
        method: "PUT",
      });

      if (response.ok) {
        // Actualizar el estado localmente para que se refleje inmediato
        setUsers(users.map(u => 
          u.user_id === id ? { ...u, activo: !u.activo } : u
        ));
      } else {
        alert("No se pudo cambiar el estado");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Filtrado por ID, Nombre o Email
  const filtered = users.filter(u =>
    u.user_id.toString().includes(filter) ||
    u.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div style={{ maxWidth: 800, margin: "4rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ margin: 0, color: "#333" }}>Lista de Usuarios</h2>
            <button onClick={() => navigate(-1)} style={{ padding: "5px 10px", cursor: "pointer" }}>Volver</button>
        </div>

        <input
          type="text"
          placeholder="Filtrar por ID, nombre o correo..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ marginBottom: "1.5rem", width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />

        {loading ? (
            <p style={{textAlign: "center"}}>Cargando usuarios...</p>
        ) : (
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                    <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
                    <th style={{ padding: "10px", borderBottom: "2px solid #eee" }}>ID</th>
                    <th style={{ padding: "10px", borderBottom: "2px solid #eee" }}>Nombre</th>
                    <th style={{ padding: "10px", borderBottom: "2px solid #eee" }}>Correo</th>
                    <th style={{ padding: "10px", borderBottom: "2px solid #eee" }}>Estado</th>
                    <th style={{ padding: "10px", borderBottom: "2px solid #eee" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(u => (
                    <tr key={u.user_id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "10px" }}>{u.user_id}</td>
                        <td style={{ padding: "10px" }}>{u.nombre}</td>
                        <td style={{ padding: "10px" }}>{u.email}</td>
                        <td style={{ padding: "10px" }}>
                        <button
                            onClick={() => toggleEstado(u.user_id)}
                            style={{
                            padding: "0.3rem 0.8rem",
                            border: "none",
                            borderRadius: "20px",
                            background: u.activo ? "#d4edda" : "#f8d7da",
                            color: u.activo ? "#155724" : "#721c24",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                            }}
                        >
                            {u.activo ? "Activo" : "Inactivo"}
                        </button>
                        </td>
                        <td style={{ padding: "10px" }}>
                        <button
                            onClick={() => navigate(`/UserDetail/${u.user_id}`)}
                            style={{ 
                                marginRight: "0.5rem", 
                                padding: "5px 10px", 
                                background: "#007bff", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "4px", 
                                cursor: "pointer" 
                            }}
                        >
                            Ver detalle
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {filtered.length === 0 && <p style={{textAlign: "center", marginTop: "20px", color: "#777"}}>No se encontraron usuarios.</p>}
            </div>
        )}
      </div>
    </>
  );
}