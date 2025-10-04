

/* Mi Cuenta */

/* Login */
/* Cuenta de Usuario: 
  Muestra Resumenes de ordenes
  recientes (lista) Con Paginación
  - Cada imagen debe redirigir a la pagina de detalle de órdenes
  -  La pagina de detalle de ordenes muestra los datos de la orden 
    Los datos no se pueden modificar
    Solo pueden se peuden cancelar la orden

  */

/* La pagina de registro 
  permite cambiar el nombre, apellido o correo
*/

/* La pagina de cambiar pasword al usuario logeado le permite
   cambiar sus passowrd
*/

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



  // Sesión iniciada
  const {nombre} = useParams();
  
  // Para cambiar nombre/correo si ya hay sesión
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");

  const handleActualizar = (e) => {
    e.preventDefault();

    if (!nuevoNombre && !nuevoEmail) {
      setError("Ingresa un nuevo nombre o correo para actualizar");
      return;
    }

    console.log("Nuevo nombre:", nuevoNombre || nombre);
    console.log("Nuevo correo:", nuevoEmail || "No actualizado");
    setError("");
    alert("Datos actualizados correctamente");
  };


  return (
    <>
    {!nombre ? ( 
      // Registro de sesión ********************************
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
    ):(
      // Cambiar nombre o correo
      <>
        <TopBar />
        <section className="login-container">
          <div className="login-card">
            <h1>Actualizar Nombre</h1>
            <form onSubmit={handleActualizar}>
              <input
                type="text"
                placeholder={`   Nuevo nombre (actual: ${nombre})`}
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <input
                type="email"
                placeholder="   Ingresar Correo Inicial"
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
              />
              <button type="submit">Actualizar Nombre</button>
            </form>
            
            <div className="login-links">
              <NavLink to={"/Password_email"+"/"+nombre}>Cambiar Contraseñar</NavLink>
            </div>
          
          </div>
        </section>
        <Footer />
      </>
      )}
    </>
  );
};

export default Login;
