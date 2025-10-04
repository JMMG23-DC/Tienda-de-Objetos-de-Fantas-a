const bestSellers = [
  { id: 1, name: "Varita mágica", price: 120 },
  { id: 2, name: "Poción de invisibilidad", price: 200 },
  { id: 3, name: "Espada legendaria", price: 350 },
  { id: 4, name: "Escudo encantado", price: 180 },
  { id: 5, name: "Anillo de poder", price: 250 },
  { id: 6, name: "Capa voladora", price: 300 },
  { id: 7, name: "Botas rápidas", price: 90 },
  { id: 8, name: "Libro de hechizos", price: 220 },
  { id: 9, name: "Amuleto de suerte", price: 80 },
  { id: 10, name: "Casco de dragón", price: 400 },
  { id: 11, name: "Guantes mágicos", price: 110 },
  { id: 12, name: "Escama de fénix", price: 500 },
];

export default function BestSellers() {
  return (
    <div className="best-sellers">
      <h2>Más vendidos del mes</h2>
      <ul>
        {bestSellers.map((item) => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
