const newProducts = [
  { id: 13, name: "Mapa encantado", price: 150, category: "Artefactos", image: "/images/mapa_encantado.jpg" },
  { id: 14, name: "Lámpara mágica", price: 210, category: "Artefactos", image: "/images/lampara_magica.jpg" },
  { id: 15, name: "Pergamino antiguo", price: 95, category: "Reliquias", image: "/images/pergamino_antiguo.jpg" },
  { id: 16, name: "Collar de runas", price: 175, category: "Reliquias", image: "/images/collar_de_runas.jpg" },
  { id: 17, name: "Cinturón de fuerza", price: 130, category: "Artefactos", image: "/images/cinturon_de_fuerza.jpg" },
  { id: 18, name: "Piedra filosofal", price: 600, category: "Reliquias", image: "/images/piedra_filosofal.jpg" },
];

export default function NewProducts({ onProductClick }) {
  return (
    <div className="new-products">
      <h3>Productos nuevos</h3>
      <ul>
        {newProducts.map((item) => (
          <li key={item.id}>
            <button 
              onClick={() => onProductClick && onProductClick(item)}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                font: "inherit"
              }}
            >
              {item.name}
            </button>
            {' '}- ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
