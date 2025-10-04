import { useCart } from "./CartContext";

const products = [
  { id: 1, name: "Varita mágica", price: 120 },
  { id: 2, name: "Poción de invisibilidad", price: 200 },
  { id: 3, name: "Espada legendaria", price: 350 },
  { id: 4, name: "Escudo encantado", price: 180 },
];

export default function ProductList() {
  const { addToCart } = useCart();

  return (
    <div className="product-list">
      <h2>Productos disponibles</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => addToCart(product)}>
              Agregar al carrito
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
