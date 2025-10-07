import { useState } from "react";

const allProducts = [
  { id: 1, name: "Varita mágica", price: 120, category: "Magia" },
  { id: 2, name: "Poción de invisibilidad", price: 200, category: "Pociones" },
  { id: 3, name: "Espada legendaria", price: 350, category: "Armas" },
  { id: 4, name: "Escudo encantado", price: 180, category: "Armas" },
  { id: 5, name: "Anillo de poder", price: 250, category: "Magia" },
  { id: 6, name: "Capa voladora", price: 300, category: "Magia" },
  { id: 7, name: "Botas rápidas", price: 90, category: "Artefactos" },
  { id: 8, name: "Libro de hechizos", price: 220, category: "Magia" },
  { id: 9, name: "Amuleto de suerte", price: 80, category: "Reliquias" },
  { id: 10, name: "Casco de dragón", price: 400, category: "Armas" },
  { id: 11, name: "Guantes mágicos", price: 110, category: "Magia" },
  { id: 12, name: "Escama de fénix", price: 500, category: "Reliquias" },
  { id: 13, name: "Mapa encantado", price: 150, category: "Artefactos" },
  { id: 14, name: "Lámpara mágica", price: 210, category: "Artefactos" },
  { id: 15, name: "Pergamino antiguo", price: 95, category: "Reliquias" },
  { id: 16, name: "Collar de runas", price: 175, category: "Reliquias" },
  { id: 17, name: "Cinturón de fuerza", price: 130, category: "Artefactos" },
  { id: 18, name: "Piedra filosofal", price: 600, category: "Reliquias" },
];

const categories = [
  ...new Set(allProducts.map((p) => p.category)),
];

export default function SearchResults({ search, onSelect }) {
  const [sort, setSort] = useState("name");
  const [filter, setFilter] = useState("");

  let results = allProducts.filter(
    (p) =>
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())) &&
      (!filter || p.category === filter)
  );

  if (sort === "name") {
    results = results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price") {
    results = results.sort((a, b) => a.price - b.price);
  }

  return (
    <div className="search-results" style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
      <aside style={{ minWidth: "180px" }}>
        <h4>Filtrar por categoría</h4>
        <ul>
          <li>
            <button onClick={() => setFilter("")}>Todas</button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button onClick={() => setFilter(cat)}>{cat}</button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Ordenar por: </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
          </select>
        </div>
        <h3>Resultados de búsqueda</h3>
        <ul>
          {results.length === 0 ? (
            <li>No se encontraron productos.</li>
          ) : (
            results.map((p) => (
              <li key={p.id}>
                <button style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline" }} onClick={() => onSelect(p)}>
                  {p.name}
                </button>
                {' '} - ${p.price} <span style={{ color: "#888" }}>({p.category})</span>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
