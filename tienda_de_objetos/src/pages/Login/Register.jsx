import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (!nombre || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/registrar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contrasena: password }),
      });

      // 1. Leer respuesta JSON (sea éxito o error)
      const data = await response.json();

      // 2. Si la respuesta NO fue exitosa erro
      if (!response.ok) {
        // Usamos el mensaje de error del backend (data.error)
        throw new Error(data.error || "Error al registrar usuario");
      }
      // -------------------------

      // Si todo salió bien:
      console.log("Usuario registrado:", data);
      alert("Usuario registrado correctamente");

      // Limpieza de campos
      setNombre("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");

      navigate("/");

    } catch (error) {
      // 3. Mostramos el error específico en el estado
      console.error("Error:", error.message);
      setError("Este correo ya esta registrado");
    }
  };

  return (
    <>
      <section className="login-container">
        <div className="login-card">
          <h1>Crear Cuenta</h1>
          {/* El error (del backend o frontend) se mostrará aquí */}
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