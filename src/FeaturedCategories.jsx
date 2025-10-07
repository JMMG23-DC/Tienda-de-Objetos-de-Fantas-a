const categories = [
  { id: 1, name: "Magia" },
  { id: 2, name: "Armas" },
  { id: 3, name: "Pociones" },
];

export default function FeaturedCategories() {
  return (
    <div className="featured-categories">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <img 
          src="/images2/categorias_destacadas.png" 
          alt="Categorías destacadas" 
          style={{ 
            maxWidth: "120px", 
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }} 
        />
        <h2 style={{ margin: 0 }}>Categorías destacadas</h2>
      </div>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
