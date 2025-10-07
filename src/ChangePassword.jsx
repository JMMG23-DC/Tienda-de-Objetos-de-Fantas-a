import { useState } from "react";

export default function ChangePassword({ onSave, onCancel }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmPass) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (newPass.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    onSave(newPass);
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h3>Cambiar contraseña</h3>
      <form onSubmit={handleSubmit}>
        <label>Contraseña actual:</label><br />
        <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} required /><br />
        <label>Nueva contraseña:</label><br />
        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} /><br />
        <label>Confirmar nueva contraseña:</label><br />
        <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required minLength={6} /><br />
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        <button type="submit" style={{ marginTop: "1rem" }}>Guardar</button>
        <button type="button" style={{ marginLeft: "1rem" }} onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}
