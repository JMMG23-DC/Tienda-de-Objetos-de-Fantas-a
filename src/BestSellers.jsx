const bestSellers = [
  { id: 1, name: "Varita mágica", price: 120, category: "Magia", image: "/images/varita_magica.jpg" },
  { id: 2, name: "Poción de invisibilidad", price: 200, category: "Pociones", image: "/images/pocion_invisibilidad.jpg" },
  { id: 3, name: "Espada legendaria", price: 350, category: "Armas", image: "/images/espada_legendaria.jpg" },
  { id: 4, name: "Escudo encantado", price: 180, category: "Armas", image: "/images/escudo_encantado.jpg" },
  { id: 5, name: "Anillo de poder", price: 250, category: "Magia", image: "/images/anillo_de_poder.jpg" },
  { id: 6, name: "Capa voladora", price: 300, category: "Magia", image: "/images/capa_voladora.jpg" },
  { id: 7, name: "Botas rápidas", price: 90, category: "Artefactos", image: "/images/botas_rapidas.jpg" },
  { id: 8, name: "Libro de hechizos", price: 220, category: "Magia", image: "/images/libro_hechizos.jpg" },
  { id: 9, name: "Amuleto de suerte", price: 80, category: "Reliquias", image: "/images/amuleto_de_suerte.jpg" },
  { id: 10, name: "Casco de dragón", price: 400, category: "Armas", image: "/images/casco_dragon.jpg" },
  { id: 11, name: "Guantes mágicos", price: 110, category: "Magia", image: "/images/guantes_magicos.jpg" },
  { id: 12, name: "Escama de fénix", price: 500, category: "Reliquias", image: "/images/escama_de_fenix.jpg" },
];

export default function BestSellers({ onProductClick }) {
  return (
    <div className="best-sellers">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <img 
          src="/images2/mas_vendidos_del_mes.png" 
          alt="Más vendidos del mes" 
          style={{ 
            maxWidth: "120px", 
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }} 
        />
        <h2 style={{ margin: 0 }}>Más vendidos del mes</h2>
      </div>
      <ul>
        {bestSellers.map((item) => (
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
