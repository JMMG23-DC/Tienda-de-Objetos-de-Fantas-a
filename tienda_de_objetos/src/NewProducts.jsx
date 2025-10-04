const newProducts = [
  { id: 1, name: "Mapa encantado", price: 150 },
  { id: 2, name: "Lámpara mágica", price: 210 },
  { id: 3, name: "Pergamino antiguo", price: 95 },
  { id: 4, name: "Collar de runas", price: 175 },
  { id: 5, name: "Cinturón de fuerza", price: 130 },
  { id: 6, name: "Piedra filosofal", price: 600 },
];

export default function NewProducts() {
  return (
    <div className="new-products">
      <h3>Productos nuevos</h3>
      <ul>
        {newProducts.map((item) => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
