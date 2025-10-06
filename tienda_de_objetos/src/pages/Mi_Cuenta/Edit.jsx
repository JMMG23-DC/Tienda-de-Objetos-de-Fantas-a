import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export const Edit = () => {
  // Obtener parámetro del nombre en la URL
  const { nombre } = useParams();

  // Estados para nuevos datos
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [error, setError] = useState("");

  const handleActualizar = (e) => {
    e.preventDefault();
    if (!nuevoNombre && !nuevoEmail) {
        alert("Datos actualizados correctamente");
      return;
    }
  };

  return (
    <>
      <section className="login-container">
        <div className="login-card">
          <h1>Actualizar datos de usuario</h1>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleActualizar}>
            <input
              type="text"
              placeholder={`Nuevo nombre (actual: ${nombre})`}
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <input
              type="email"
              placeholder="Nuevo correo electrónico"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
            <button type="submit">Actualizar datos</button>
          </form>

          <div className="login-links">
            <NavLink to={`/Password_email/${nombre}`}>Cambiar Contraseña</NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default Edit;
