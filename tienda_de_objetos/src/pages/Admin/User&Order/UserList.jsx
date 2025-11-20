import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  // 1. Cargar usuarios reales desde la BD
  useEffect(() => {
    fetch("http://localhost:4000/admin/usuarios")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  // 2. Manejar la activación/desactivación
  const toggleEstado = async (id, estadoActual) => {
    const accion = estadoActual ? "desactivar" : "activar";
    if (!window.confirm(`¿Estás seguro de que deseas ${accion} a este usuario?`)) return;

    try {
      const response = await fetch(`http://localhost:4000/admin/usuarios/${id}/estado`, {
        method: "PUT",
      });

      if (response.ok) {
        // Actualizamos la lista localmente para ver el cambio inmediato
        setUsers(users.map((u) => 
          u.user_id === id ? { ...u, activo: !u.activo } : u
        ));
      } else {
        alert("Error al actualizar el estado en el servidor.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Filtrado por nombre o correo
  const filtered = users.filter((u) =>
    u.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2>Gestión de Usuarios Registrados</h2>
      
      <button onClick={() => navigate("/AdminDashboard")} style={{ marginBottom: "1rem", cursor: "pointer" }}>
        &larr; Volver al Dashboard
      </button>

      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.user_id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{u.user_id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                <span style={{
                  color: u.activo ? "green" : "red",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: u.activo ? "#e8f5e9" : "#ffebee"
                }}>
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => toggleEstado(u.user_id, u.activo)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    background: u.activo ? "#e53935" : "#43a047",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  {u.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => navigate(`/UserDetail/${u.user_id}`)}
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No se encontraron usuarios.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}