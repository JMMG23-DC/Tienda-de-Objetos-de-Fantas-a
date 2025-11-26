import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Asegúrate de que estas rutas sean correctas en tu estructura de carpetas local
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 1. Obtenemos el ID del usuario guardado en el login
  const idUsuario = localStorage.getItem("usuario_id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // --- Validación del Frontend ---
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }

    if (!idUsuario) {
      setError("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.");
      return;
    }

    // --- Lógica del Backend (fetch) ---
    try {
      const response = await fetch("http://localhost:3000/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idUsuario, // 2. Enviamos el ID correcto al backend
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar la contraseña.");
      }

      // Éxito
      setMessage(data.message);
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      setError(error.message);
      setMessage("");
    }
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
            <NavLink to="/Sesion">Volver a Mi Cuenta</NavLink>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ChangePassword;
