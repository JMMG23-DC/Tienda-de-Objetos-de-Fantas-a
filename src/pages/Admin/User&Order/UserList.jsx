import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { id: 1, nombre: "Ana", apellido: "Torres", correo: "ana.torres@gmail.com", activo: true },
  { id: 2, nombre: "Luis", apellido: "Doig", correo: "doigluis@gmail.com", activo: false },
  { id: 3, nombre: "Maria", apellido: "Rojas", correo: "marojas@gmail.com", activo: true },
  { id: 4, nombre: "Carlos", apellido: "Lazo", correo: "clazo@hotmail.com", activo: false },
  { id: 5, nombre: "Sofia", apellido: "Lopez", correo: "soflopez@hotmail.com", activo: true },
];

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
