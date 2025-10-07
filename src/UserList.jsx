import { useState } from "react";

// Simulación de usuarios
const mockUsers = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  nombre: `Nombre${i + 1}`,
  apellido: `Apellido${i + 1}`,
  correo: `usuario${i + 1}@mail.com`,
  activo: true,
}));

export default function UserList({ onUserDetail }) {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState("");

  function handleDeactivate(id) {
    setUsers(users.map(u => u.id === id ? { ...u, activo: false } : u));
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
            <tr key={u.id} style={{ background: u.activo ? "#fff" : "#fee" }}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.correo}</td>
              <td>{u.activo ? "Activo" : "Desactivado"}</td>
              <td>
                <button onClick={() => onUserDetail(u)} style={{ marginRight: "0.5rem" }}>Ver detalle</button>
                {u.activo && <button style={{ background: "#c00", color: "#fff" }} onClick={() => handleDeactivate(u.id)}>Desactivar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
