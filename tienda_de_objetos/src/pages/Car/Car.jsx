import React, { useState } from "react";
import {TopBar} from "../Home/components/TopBar"

import {Footer} from "../Home/components/Footer"



function App() {
  // Lista de productos de ejemplo
  const products = [
    { id: 1, name: "Poción de Curación", price: 25 },
    { id: 2, name: "Espada Mágica", price: 100 },
    { id: 3, name: "Escudo Legendario", price: 75 },
  ];

  const [cart, setCart] = useState([]);

  // Función para añadir producto al carrito
  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <>
    <TopBar></TopBar>
    
    <div className="app">
      <h1>🧙‍♂️ Tienda Mágica</h1>

      <div className="products">
        {products.map((product) => (
          <Car key={product.id} product={product} onAdd={handleAddToCart} />
        ))}
      </div>

      <Cart cart={cart} />
    </div>
    <Footer></Footer>
    </>
  );
}

// Componente del producto
function Car({ product, onAdd }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Precio: ${product.price}</p>
      <button onClick={() => onAdd(product)}>Añadir al carrito</button>
    </div>
  );
}

// Componente del carrito
function Cart({ cart }) {
  return (
    <div className="cart">
      <h2>🛒 Carrito</h2>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <ul>
            {cart.map((item, i) => (
              <li key={i}>
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>

          <CartTotal cart={cart} />
        </>
      )}
    </div>
  );
}

// Componente interno para mostrar el total
function CartTotal({ cart }) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="cart-total">
      <hr />
      <p><strong>Total:</strong> ${total}</p>
    </div>
  );
}

export default App;
