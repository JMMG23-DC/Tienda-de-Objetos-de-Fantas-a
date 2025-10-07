import { useState } from "react";

export default function EditUserData({ user, onSave, onCancel }) {
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [apellido, setApellido] = useState(user?.apellido || "");
  const [correo, setCorreo] = useState(user?.correo || "");
  const [error, setError] = useState("");

  function validateEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !apellido || !correo) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(correo)) {
      setError("El correo no tiene un formato válido.");
      return;
    }
    setError("");
    onSave({ nombre, apellido, correo });
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Editar datos de usuario</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label><br />
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required /><br />
        <label>Apellido:</label><br />
        <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} required /><br />
        <label>Correo:</label><br />
        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required /><br />
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        <button type="submit" style={{ marginTop: "1rem" }}>Guardar cambios</button>
        <button type="button" style={{ marginLeft: "1rem" }} onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}
