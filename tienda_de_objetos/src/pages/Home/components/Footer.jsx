import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import "./footer.css"

export const Footer = () => {
  return (
    <>
    <footer className="footer">
        <div className="footer-col">
            <h3>Shop Star</h3>
            <p>Breve Descripción</p>
        </div>

        <div className="footer-col">
            <h3>Categorias</h3>
            <NavLink to="/">Home</NavLink>
            <NavLink to="Producto">Producto</NavLink>
            <NavLink to="Login">Iniciar Sesión</NavLink>
            
        </div>

        <div className="footer-col">
            <h3>Soporte</h3>
            <NavLink to="/">Centro de Ayuda</NavLink>
            <NavLink to="/">Política de Envíos</NavLink>
            <NavLink to="/">Devoluciones</NavLink>
            <NavLink to="/">Contacto</NavLink>
        </div>

        <div className="footer-border">
            <p>2024 ShopStar. Todos los derechos reservados</p>
            <br></br>
        </div>


    </footer>

    </>
  );
};

export default Footer