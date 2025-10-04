import { useCart } from "./CartContext";

export default function ProductDetail({ product, onBack }) {
  const { addToCart } = useCart();

  if (!product) return <div>No se encontró el producto.</div>;

  return (
    <div className="product-detail" style={{ padding: "2rem" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>Volver</button>
      <h2>{product.name}</h2>
      <p><strong>Categoría:</strong> {product.category}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>ID:</strong> {product.id}</p>
      <button onClick={() => addToCart(product)} style={{ marginTop: "1rem" }}>
        Agregar al carrito
      </button>
    </div>
  );
}
