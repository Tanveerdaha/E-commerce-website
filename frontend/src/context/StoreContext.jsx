import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';
import defaultProducts from '../data/products';

const AUTH_STORAGE_KEYS = {
  token: 'northstar-token',
  user: 'northstar-user',
};

const StoreContext = createContext();

const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
  const user = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  return token && user ? { token, user: JSON.parse(user) } : null;
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = auth?.token;

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEYS.token, auth.token);
      localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(auth.user));
    }
  }, [auth]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, cartResponse, wishlistResponse] = await Promise.all([
          apiGet('/products'),
          token ? apiGet('/cart', token) : Promise.resolve({ cart: [] }),
          token ? apiGet('/wishlist', token) : Promise.resolve({ wishlist: [] }),
        ]);

        const nextProducts = productsResponse.products?.length ? productsResponse.products : defaultProducts;
        setProducts(nextProducts);
        setCart(cartResponse.cart || []);
        setWishlist(wishlistResponse.wishlist || []);
        setError('');
      } catch (err) {
        setProducts(defaultProducts);
        setError(err.message || 'Unable to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiPost('/auth/login', { email, password });
    localStorage.setItem(AUTH_STORAGE_KEYS.token, data.token);
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });
    setCart([]);
    setWishlist([]);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiPost('/auth/register', { name, email, password });
    localStorage.setItem(AUTH_STORAGE_KEYS.token, data.token);
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });
    setCart([]);
    setWishlist([]);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.token);
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    setAuth(null);
    setCart([]);
    setWishlist([]);
  };

  const refreshCart = async () => {
    if (!token) return;
    const data = await apiGet('/cart', token);
    setCart(data.cart || []);
  };

  const refreshWishlist = async () => {
    if (!token) return;
    const data = await apiGet('/wishlist', token);
    setWishlist(data.wishlist || []);
  };

  const addToCart = async (product) => {
    if (token) {
      const data = await apiPost('/cart/add', { ...product, quantity: 1 }, token);
      setCart(data.cart || []);
    } else {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
    setIsCartOpen(true);
  };

  const addToWishlist = async (product) => {
    if (token) {
      const data = await apiPost('/wishlist/toggle', product, token);
      setWishlist(data.wishlist || []);
    } else {
      setWishlist((prev) => prev.some((item) => item.id === product.id) ? prev : [...prev, product]);
    }
  };

  const toggleWishlist = async (product) => {
    if (token) {
      const data = await apiPost('/wishlist/toggle', product, token);
      setWishlist(data.wishlist || []);
    } else {
      setWishlist((prev) => prev.some((item) => item.id === product.id) ? prev.filter((item) => item.id !== product.id) : [...prev, product]);
    }
  };

  const removeFromCart = async (id) => {
    if (token) {
      const data = await apiDelete(`/cart/${id}`, token);
      setCart(data.cart || []);
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = async (id, delta) => {
    const currentItem = cart.find((item) => item.id === id);
    if (!currentItem) return;

    const nextQuantity = Math.max(1, currentItem.quantity + delta);

    if (token) {
      const data = await apiPut('/cart/update', { id, quantity: nextQuantity }, token);
      setCart(data.cart || []);
    } else {
      setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: nextQuantity } : item));
    }
  };

  const checkout = async (total) => {
    if (!token) return null;
    const data = await apiPost('/orders/checkout', { total }, token);
    setCart([]);
    return data;
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  return (
    <StoreContext.Provider value={{
      products,
      searchQuery,
      setSearchQuery,
      cart,
      wishlist,
      isCartOpen,
      auth,
      loading,
      error,
      setIsCartOpen,
      addToCart,
      addToWishlist,
      toggleWishlist,
      removeFromCart,
      updateQuantity,
      checkout,
      login,
      register,
      logout,
      refreshCart,
      refreshWishlist,
      subtotal,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
