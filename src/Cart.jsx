
import { useCart } from "./CartContext";
import { useState } from "react";
import Checkout from "./Checkout.jsx";

export default function Cart({ loggedIn }) {
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderSummary, setOrderSummary] = useState({ items: [], total: 0 });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (showCheckout) {
    if (!loggedIn) {
      return (
        <div style={{ padding: "2rem" }}>
          <h2>Debes iniciar sesión para completar la orden.</h2>
        </div>
      );
    }
    return (
      <Checkout
        cart={cart}
        total={total}
        onComplete={() => {
          setOrderSummary({ items: [...cart], total });
          setShowCheckout(false);
          setOrderComplete(true);
          clearCart();
        }}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }
  if (orderComplete) {
    return (
      <div className="order-page" style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
        <h2>¡Pedido completado!</h2>
        <p>Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
        <div style={{ marginTop: "1rem" }}>
          <h4>Resumen de la orden</h4>
          <ul>
            {orderSummary.items.map(item => (
              <li key={item.id}>{item.name} x {item.quantity} = ${item.price * item.quantity}</li>
            ))}
          </ul>
          <div><strong>Total pagado:</strong> ${orderSummary.total}</div>
        </div>
        <button onClick={() => setOrderComplete(false)} style={{ marginTop: "1rem" }}>Volver al carrito</button>
      </div>
    );
  }

  return (
    <div className="cart">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <img 
          src="/images2/carrito_de_compras.png" 
          alt="Carrito de compras" 
          style={{ 
            maxWidth: "120px", 
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }} 
        />
        <h2 style={{ margin: 0 }}>Carrito de compras</h2>
      </div>
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
  <button onClick={() => setShowCheckout(true)} style={{ marginLeft: "1rem" }}>Completar orden</button>

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
