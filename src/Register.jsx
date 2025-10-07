import { useState } from "react";

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export default function Register({ onBack, onRegister }) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!user || !email || !pass) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(email)) {
      setError("El email no tiene un formato válido.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setError("");
    if (onRegister) onRegister(user);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "350px", margin: "auto" }}>
      <h3>Registro de usuario</h3>
      <form onSubmit={handleSubmit}>
        <label>Usuario:</label><br />
        <input type="text" value={user} onChange={e => setUser(e.target.value)} required /><br />
        <label>Email:</label><br />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <label>Contraseña:</label><br />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6} /><br />
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        <button type="submit" style={{ marginTop: "1rem" }}>Registrar</button>
        <button type="button" style={{ marginLeft: "1rem" }} onClick={onBack}>Volver</button>
      </form>
    </div>
  );
}
