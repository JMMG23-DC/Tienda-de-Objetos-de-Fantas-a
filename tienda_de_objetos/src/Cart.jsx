import { useCart } from "./CartContext";
import { useState } from "react";

export default function Cart() {
  const {
    cart,
    saved,
    removeFromCart,
    clearCart,
    updateQuantity,
    saveForLater,
    removeSaved,
    moveToCart
  } = useCart();
  const [showOrder, setShowOrder] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (showOrder) {
    return (
      <div className="order-page">
        <h2>Completar orden</h2>
        <p>¡Gracias por tu compra! (Simulación)</p>
        <button onClick={() => setShowOrder(false)}>Volver al carrito</button>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Carrito de compras</h2>
      {cart.length === 0 ? (
        <div>Carrito vacío</div>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                min={1}
                value={item.quantity}
                style={{ width: "40px", margin: "0 8px" }}
                onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
              />
              = ${item.price * item.quantity}
              <button onClick={() => removeFromCart(item.id)}>Quitar</button>
              <button onClick={() => saveForLater(item.id)} style={{ marginLeft: "8px" }}>Guardar para después</button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: "1rem" }}>
        <strong>Total: ${total}</strong>
      </div>
      <button onClick={clearCart} style={{ marginTop: "1rem" }}>Vaciar carrito</button>
      <button onClick={() => setShowOrder(true)} style={{ marginLeft: "1rem" }}>Completar orden</button>

      <div style={{ marginTop: "2rem" }}>
        <h3>Guardados para después</h3>
        {saved.length === 0 ? (
          <div>No hay ítems guardados.</div>
        ) : (
          <ul>
            {saved.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}
                <button onClick={() => moveToCart(item.id)} style={{ marginLeft: "8px" }}>Mover al carrito</button>
                <button onClick={() => removeSaved(item.id)} style={{ marginLeft: "8px" }}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
