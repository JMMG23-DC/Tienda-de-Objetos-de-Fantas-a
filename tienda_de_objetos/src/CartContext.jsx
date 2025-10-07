import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState(() => {
    const s = localStorage.getItem("savedItems");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedItems", JSON.stringify(saved));
  }, [saved]);

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Si estaba en guardados, lo quita
    setSaved((prev) => prev.filter((item) => item.id !== product.id));
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  }

  function saveForLater(productId) {
    const item = cart.find((i) => i.id === productId);
    if (item) {
      setSaved((prev) => [...prev, item]);
      setCart((prev) => prev.filter((i) => i.id !== productId));
    }
  }

  function removeSaved(productId) {
    setSaved((prev) => prev.filter((item) => item.id !== productId));
  }

  function moveToCart(productId) {
    const item = saved.find((i) => i.id === productId);
    if (item) {
      addToCart(item);
      setSaved((prev) => prev.filter((i) => i.id !== productId));
    }
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{
      cart,
      saved,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      saveForLater,
      removeSaved,
      moveToCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
