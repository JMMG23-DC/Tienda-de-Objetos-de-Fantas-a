import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const Password = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      setMessage("");
      return;
    }

    // Aquí iría la lógica para enviar correo de recuperación
    setError("");
    setMessage(`Se ha enviado un correo de recuperación a ${email}`);
    setEmail("");
  };



  const {nombre} = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      setMessage("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setMessage("");
    }
  };

  return (
    <>
    {!nombre ? ( 
      <>
      <section className="login-container">
        <div className="login-card">
          <h1>Recuperar Contraseña</h1>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Enviar Correo</button>
          </form>

          <div className="login-links">
            <NavLink to="/Login">Volver al Login</NavLink>
          </div>
        </div>
      </section>

      <Footer />
    </>
    ):(
      // Cambiar contraseña
      <>
      <section className="login-container">
            <div className="login-card">
              <h1>Cambiar Contraseña</h1>

              {error && <p className="error">{error}</p>}
              {message && <p className="success">{message}</p>}

              <form onSubmit={handleChangePassword}>
                <input
                  type="password"
                  placeholder="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Actualizar Contraseña</button>
              </form>

              {/*¿Pregunta Esta Bien cambiar la contraseña y volver a registrarse?*/ }
              <div className="login-links">
                <NavLink to="/">Volver a Inicio</NavLink>
              </div>
            </div>
          </section>      
      <Footer />
      </>
      )}
      </>
  );
};

export default Password;
