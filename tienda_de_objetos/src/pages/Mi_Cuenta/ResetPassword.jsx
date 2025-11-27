import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Obtener ID desde la URL: ?id=123
  const query = new URLSearchParams(window.location.search);
  const id_usuario = query.get("id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(`http://3.131.85.192:3000/change-passwordd`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "No se pudo actualizar la contraseña");

      setMessage("Contraseña actualizada correctamente");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="login-container">
        <div className="login-card">
          <h1>Restablecer Contraseña</h1>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Actualizar Contraseña</button>
          </form>

          <div className="login-links">
            <NavLink to="/login">Volver al Login</NavLink>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ResetPassword;
