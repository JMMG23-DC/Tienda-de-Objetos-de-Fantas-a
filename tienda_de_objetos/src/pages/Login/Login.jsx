import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { TopBar } from "../Home/components/TopBar";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const Login = () => {
  
  // Quitamos 'nombre', no es necesario para el login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // La lógica de handleSubmit ahora es asíncrona para llamar al fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      // 1. Llamar a la nueva ruta /login del backend 
      const response = await fetch("http://3.131.85.192:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos 'password' como 'contrasena'
        body: JSON.stringify({ email, contrasena: password }),
      });

      const data = await response.json();

      // 2. Si el backend envió un error (ej: 400)
      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      console.log("Login exitoso:", data);

      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("usuario_id", data.id_usuario)

      navigate("/"); // Redirigir al inicio

    } catch (error) {
      // 4. Capturar y mostrar errores (ej: "Contraseña incorrecta")
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
// ... (El resto de tu JSX no cambia) ...
    <>
      <TopBar />
      <section className="login-container">
        <div className="login-card">
          <h1>Iniciar Sesión</h1>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Input de 'nombre' eliminado */}
            <input
              type="email"
              placeholder=" Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder=" Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Iniciar Sesión</button>
          </form>

          <div className="login-links">
            <NavLink to="/Password_email">Olvidé mi password</NavLink> |{" "}
            <NavLink to="/Register">Crear cuenta</NavLink>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;