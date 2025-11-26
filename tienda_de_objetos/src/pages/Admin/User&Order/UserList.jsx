import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

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

  const toggleEstado = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}/toggle`, {
        method: "PUT",
      });

      if (response.ok) {
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

  const filtered = users.filter(u =>
    u.user_id.toString().includes(filter) ||
    u.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0002"
      }}
    >

      {/* TÍTULO */}
      <h2 style={{ marginBottom: "1.5rem" }}>Lista de Usuarios</h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o correo..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "1.5rem",
          border: "1px solid #ccc",
          borderRadius: 4
        }}
      />

      <button onClick={() => navigate(-1)}>Regresar Admin</button>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Cargando usuarios...
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
              <th style={{ padding: 10 }}>ID</th>
              <th style={{ padding: 10 }}>Nombre</th>
              <th style={{ padding: 10 }}>Correo</th>
              <th style={{ padding: 10 }}>Estado</th>
              <th style={{ padding: 10 }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(u => (
              <tr key={u.user_id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{u.user_id}</td>
                <td style={{ padding: 10 }}>{u.nombre}</td>
                <td style={{ padding: 10 }}>{u.email}</td>

                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => toggleEstado(u.user_id)}
                    style={{
                      padding: "4px 10px",
                      border: "none",
                      borderRadius: 4,
                      background: u.activo ? "#d4edda" : "#f8d7da",
                      color: "#333",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </button>
                </td>

                <td style={{ padding: 10 }}>
                  <button onClick={() => navigate(`/UserDetail/${u.user_id}`)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

      {filtered.length === 0 && !loading && (
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#777" }}>
          No se encontraron usuarios.
        </p>
      )}

    </div>
  );
}
