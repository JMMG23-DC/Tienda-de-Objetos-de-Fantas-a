import { Outlet, NavLink } from "react-router-dom";
import "./topbar.css";
import { useEffect, useState } from "react";

export const TopBar = () => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    setNombre(localStorage.getItem("nombre") || "");
  }, []);

  return (
    <>
      {nombre === "" ? (
        <div className="top-bar">
          <button>Buscar</button>
          <input placeholder="buscador de productos" />
          <nav className="nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/Producto">Producto</NavLink>
            <NavLink to="/Login">Iniciar Sesión</NavLink>
          </nav>
        </div>
      ) : nombre === "Admin" ? (
        <div className="top-bar">
          <button>Buscar</button>
          <input placeholder="buscador de productos" />
          <nav className="nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/Producto">Producto</NavLink>
            <NavLink to="/AdminDashBoard">Mi Cuenta: {nombre}</NavLink>
          </nav>
        </div>
      ) : (
        <div className="top-bar">
          <button>Buscar</button>
          <input placeholder="buscador de productos" />
          <nav className="nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/Producto">Producto</NavLink>
            <NavLink to="/Sesion">Mi Cuenta: {nombre}</NavLink>
          </nav>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default TopBar;
