export default function Footer() {
  function handleClick(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <footer className="footer" style={{ marginTop: "2rem", padding: "1rem", background: "#f2f2f2", textAlign: "center" }}>
      <nav>
        <a href="#categorias" onClick={e => handleClick(e, "categorias")}>Categorías</a> |{' '}
        <a href="#mas-vendidos" onClick={e => handleClick(e, "mas-vendidos")}>Más vendidos</a> |{' '}
        <a href="#nuevos" onClick={e => handleClick(e, "nuevos")}>Nuevos productos</a> |{' '}
        <a href="#carrito" onClick={e => handleClick(e, "carrito")}>Carrito</a>
      </nav>
      <div style={{ marginTop: "0.5rem", fontSize: "0.9em" }}>
        &copy; 2025 Tienda de Objetos de Fantasía
      </div>
    </footer>
  );
}
