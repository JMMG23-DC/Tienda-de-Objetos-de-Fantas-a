import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulación de usuarios
const mockUsers = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  nombre: `Nombre${i + 1}`,
  apellido: `Apellido${i + 1}`,
  correo: `usuario${i + 1}@mail.com`,
  activo: i % 2 === 0, // algunos activos, otros desactivados
}));

export default function UserList({ onUserDetail }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState("");

  function toggleEstado(id) {
    setUsers(users.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
  }

  const filtered = users.filter(u =>
    u.id.toString().includes(filter) ||
    u.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    u.apellido.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Lista de usuarios registrados</h2>
      <input
        type="text"
        placeholder="Filtrar por ID, nombre o apellido"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.correo}</td>
              <td>
                <button
                  onClick={() => toggleEstado(u.id)}
                  style={{
                    padding: "0.2rem 0.5rem",
                    border: "none",
                    borderRadius: 4,
                    background: u.activo ? "green" : "red",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  {u.activo ? "Activo" : "Desactivado"}
                </button>
              </td>
              <td>
                <button
                  onClick={() => navigate(`/UserDetail/${u.id}`)}
                  style={{ marginRight: "0.5rem" }}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
