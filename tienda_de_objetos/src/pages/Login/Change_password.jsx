import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden");
      setMessage("");
      return;
    }

    // Aquí iría la lógica real con tu backend
    console.log("Contraseña actual:", currentPassword);
    console.log("Nueva contraseña:", newPassword);

    setError("");
    setMessage("¡Contraseña actualizada con éxito!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Redirigir a "Mi cuenta" después de cambiar la contraseña
    // navigate("/mi-cuenta");
  };

  return (
    <>
      <section className="login-container">
        <div className="login-card">
          <h1>Cambiar Contraseña</h1>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Contraseña Actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
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
            <NavLink to="/mi-cuenta">Volver a Mi Cuenta</NavLink>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ChangePassword;
