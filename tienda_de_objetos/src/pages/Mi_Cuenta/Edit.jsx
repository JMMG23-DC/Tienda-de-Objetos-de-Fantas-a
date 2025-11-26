import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const Edit = () => {
  const navigate = useNavigate();
  
  // Datos actuales para mostrar y para enviar
  const [nombreActual, setNombreActual] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);

  // Estados del formulario
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  
  // Estados de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // 1. Recuperamos ID y Nombre del localStorage al cargar
    const idStored = localStorage.getItem("usuario_id");
    const nombreStored = localStorage.getItem("nombre");

    if (idStored) setIdUsuario(idStored);
    if (nombreStored) {
        setNombreActual(nombreStored);
        setNuevoNombre(nombreStored); // Pre-llenamos el input con el nombre actual
    }
  }, []);

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones frontend
    if (!nuevoNombre.trim() || !nuevoEmail.trim()) {
      setError("Por favor completa ambos campos.");
      return;
    }

    if (!idUsuario) {
      setError("No se pudo identificar al usuario. Inicia sesión nuevamente.");
      return;
    }

    try {
      // 2. Petición al Backend
      const response = await fetch("http://localhost:3000/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idUsuario,
          nuevoNombre: nuevoNombre,
          nuevoEmail: nuevoEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el backend dice "correo en uso", o cualquier otro error
        throw new Error(data.error || "No se pudo actualizar los datos.");
      }

      // 3. Éxito: Actualizamos localStorage y redireccionamos
      setSuccess(data.message);
      localStorage.setItem("nombre", nuevoNombre); // Actualizamos el nombre localmente
      
      setTimeout(() => {
        alert("Datos actualizados correctamente");
        navigate("/Sesion");
      }, 1000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="login-container">
        <div className="login-card">
          <h1>Actualizar datos</h1>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleActualizar}>
            <label style={{display: "block", marginBottom: "5px", textAlign: "left", fontSize: "0.9rem", color: "#666"}}>Nombre:</label>
            <input
              type="text"
              placeholder={`Nombre actual: ${nombreActual}`}
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            
            <label style={{display: "block", marginBottom: "5px", textAlign: "left", fontSize: "0.9rem", color: "#666"}}>Nuevo Correo:</label>
            <input
              type="email"
              placeholder="Ingresa tu nuevo correo"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
            
            <button type="submit">Actualizar datos</button>
          </form>

          <div className="login-links" style={{marginTop: "15px"}}>
            <NavLink to={`/Password_email`}>¿Quieres cambiar tu contraseña?</NavLink>
            <br />
            <NavLink to="/Sesion" style={{marginTop: "10px", display: "inline-block"}}>Cancelar</NavLink>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Edit;
