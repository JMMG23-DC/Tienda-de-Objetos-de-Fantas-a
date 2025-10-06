import { useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { TopBar } from "../Home/components/TopBar";
import { Footer } from "../Home/components/Footer"
import "../Login/login.css"

export const Login = () => {
  const [nombre_registro, setNombre] = useState(""); // nuevo campo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Para redireccionar después del login

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre_registro || !email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Aquí iría la lógica de autenticación con tu backend
    console.log("Nombre:", nombre_registro);
    console.log("Email:", email);
    console.log("Password:", password);
    setError("");

    // Redirigir a la página principal o a "Mi cuenta"
    navigate("/Home/"+nombre_registro);
  };

  return (
      // Iniciar Sesión ********************************
      <>
      <TopBar />
      <section className="login-container">
        <div className="login-card">
          <h1>Iniciar Sesión</h1>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="  Nombre"
              value={nombre_registro}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="email"
              placeholder="  Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="  Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Iniciar Sesión</button>
          </form>

          <div className="login-links">
            <NavLink to="/Password_email">Olvidé mi password</NavLink>  |  
            <NavLink to="/Register">Crear cuenta</NavLink>
          </div>
        </div>
      </section>
      <Footer />
      </>
    
  );
};

export default Login;
