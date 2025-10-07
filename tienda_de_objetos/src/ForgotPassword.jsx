import { useState } from "react";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "350px", margin: "auto" }}>
      <h3>Recuperar contraseña</h3>
      {sent ? (
        <div>Se ha enviado un correo para recuperar tu contraseña.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
          <button type="submit" style={{ marginTop: "1rem" }}>Enviar</button>
          <button type="button" style={{ marginLeft: "1rem" }} onClick={onBack}>Volver</button>
        </form>
      )}
    </div>
  );
}
