import { useState } from "react";

export default function LoginForm({ onLogin, forgotPassword, register }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Usuario y contraseña de ejemplo
    if (user === "usuario" && pass === "1234") {
      setError("");
      onLogin(user);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "8px", maxWidth: "300px", margin: "auto" }}>
      <h3>Iniciar sesión</h3>
      <div>
        <label>Usuario:</label><br />
        <input type="text" value={user} onChange={e => setUser(e.target.value)} required />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>Contraseña:</label><br />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} required />
      </div>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      <button type="submit" style={{ marginTop: "1rem" }}>Entrar</button>
      <div style={{ marginTop: "1rem" }}>
        <a href="#" onClick={e => { e.preventDefault(); forgotPassword(); }}>Olvidé mi password</a>
        <span style={{ marginLeft: "1rem" }}>
          <a href="#" onClick={e => { e.preventDefault(); register(); }}>Registrarme</a>
        </span>
      </div>
    </form>
  );
}
