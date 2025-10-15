import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos
    if (!nombre || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Validación de que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");

    // Redirigir al Home con usuario logueado
    navigate("/");
  };

  return (
    <>

      <section className="login-container">
        <div className="login-card">
          <h1>Crear Cuenta</h1>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre Completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>

          <div className="login-links">
            <NavLink to="/Login">Ya tengo cuenta</NavLink>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Register;
