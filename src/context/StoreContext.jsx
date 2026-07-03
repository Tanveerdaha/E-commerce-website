import { createContext, useContext, useMemo, useState } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => prev.some((item) => item.id === product.id) ? prev : [...prev, product]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => prev.some((item) => item.id === product.id) ? prev.filter((item) => item.id !== product.id) : [...prev, product]);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const updateQuantity = (id, delta) => setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  return (
    <StoreContext.Provider value={{ cart, wishlist, isCartOpen, setIsCartOpen, addToCart, addToWishlist, toggleWishlist, removeFromCart, updateQuantity, subtotal }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
