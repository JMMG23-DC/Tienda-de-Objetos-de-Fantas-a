const categories = [
  { id: 1, name: "Magia" },
  { id: 2, name: "Armas" },
  { id: 3, name: "Pociones" },
];

export default function FeaturedCategories() {
  return (
    <div className="featured-categories">
      <h2>Categorías destacadas</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
