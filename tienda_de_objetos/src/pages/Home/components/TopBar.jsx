import { Outlet, NavLink, useParams } from "react-router-dom";
import "./topbar.css"


export const TopBar = () => {
    const {nombre} = useParams()
    
    return (
    <>
    {/*Nombre undifned*/ }
    {!nombre ? ( 
      <div className="top-bar">
        <input placeholder="buscador de productos"></input>
        <nav className="nav">
          <NavLink to="Carrito">Carrito de Compras</NavLink>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/Producto">Producto</NavLink>
          <NavLink to="/Login">Iniciar Sesión</NavLink>
        </nav>
      </div>
    ):(
      <div className="top-bar">
        <input placeholder="buscador de productos"></input>
        <nav className="nav">
          <NavLink to="Carrito">Carrito de Compras</NavLink>
          <NavLink to="/">Home</NavLink>
          <NavLink to={"/Producto"+"/"+nombre}>Producto</NavLink>
          <NavLink to={"/Login"+"/"+nombre}>{nombre}</NavLink>
        </nav>
      </div>
    )}
    <Outlet />
    </>
  );
};

export default TopBar