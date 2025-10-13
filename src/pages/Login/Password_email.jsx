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
  return (
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
  );
};

export default Password;
