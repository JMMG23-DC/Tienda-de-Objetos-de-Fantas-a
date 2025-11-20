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

  // Obtenemos el ID del usuario logueado desde localStorage
  const nombreUsuario = localStorage.getItem("nombre");

  // La función debe ser 'async' para usar 'await' con fetch
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

    if(!nombreUsuario){
      return
    }

    // --- Lógica del Backend (fetch) ---
    try {
      const response = await fetch("http://localhost:3000/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreUsuario, // Enviamos el ID del usuario
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si hay un error (ej: 400), usamos el mensaje del backend
        // (ej: "La contraseña actual es incorrecta.")
        throw new Error(data.error || "No se pudo actualizar la contraseña.");
      }

      // Si todo sale bien
      setMessage(data.message); // "¡Contraseña actualizada con éxito!"
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      // Capturamos el error (ej: "La contraseña actual es incorrecta")
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
            {/* Usamos 'to="/Sesion"' para volver al perfil */}
            <NavLink to="/Sesion">Volver a Mi Cuenta</NavLink>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ChangePassword;