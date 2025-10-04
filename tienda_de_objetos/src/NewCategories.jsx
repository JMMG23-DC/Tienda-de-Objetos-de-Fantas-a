const newCategories = [
  { id: 1, name: "Reliquias" },
  { id: 2, name: "Artefactos" },
  { id: 3, name: "Criaturas" },
];

export default function NewCategories() {
  return (
    <div className="new-categories">
      <h3>Categorías nuevas</h3>
      <div style={{ display: "flex", gap: "1rem" }}>
        {newCategories.map((cat) => (
          <div key={cat.id} className="category-panel">
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
