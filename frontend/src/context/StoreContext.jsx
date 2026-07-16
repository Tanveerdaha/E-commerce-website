import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';
import {
  USER_AUTH_KEYS,
  clearSession,
  getStoredSession,
  saveAuthSession,
  subscribeAuthChanges,
} from '../services/authStorage';
import { getCartTotal } from '../utils/pricing';
import defaultProducts from '../data/products';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [auth, setAuth] = useState(() => getStoredSession(USER_AUTH_KEYS));
  const [loading, setLoading] = useState(true);

  const token = auth?.token;

  useEffect(() => subscribeAuthChanges((session, nextAuth) => {
    if (session === 'user') {
      setAuth(nextAuth);
      if (!nextAuth) {
        setCart([]);
        setWishlist([]);
      }
    }
  }), []);

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
      } catch {
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const login = async (email, password) => {
    const guestCart = token ? [] : [...cart];
    const data = await apiPost('/auth/login', { email, password });
    const nextAuth = saveAuthSession('user', data);
    setAuth(nextAuth);

    if (guestCart.length) {
      for (const item of guestCart) {
        await apiPost('/cart/add', item, nextAuth.token);
      }
    }

    const cartData = await apiGet('/cart', nextAuth.token);
    const wishlistData = await apiGet('/wishlist', nextAuth.token);
    setCart(cartData.cart || []);
    setWishlist(wishlistData.wishlist || []);
    return data;
  };

  const register = async (name, email, password) => {
    const guestCart = token ? [] : [...cart];
    const data = await apiPost('/auth/register', { name, email, password });
    const nextAuth = saveAuthSession('user', data);
    setAuth(nextAuth);

    if (guestCart.length) {
      for (const item of guestCart) {
        await apiPost('/cart/add', item, nextAuth.token);
      }
    }

    const cartData = await apiGet('/cart', nextAuth.token);
    setCart(cartData.cart || []);
    setWishlist([]);
    return data;
  };

  const logout = () => {
    clearSession(USER_AUTH_KEYS);
    setAuth(null);
    setCart([]);
    setWishlist([]);
  };

  const rateProduct = async (productId, rating) => {
    if (!token) throw new Error('Please log in to rate products');
    const data = await apiPost(`/products/${productId}/rate`, { rating }, token);
    setProducts((prev) => prev.map((item) => (item.id === productId ? data.product : item)));
    return data;
  };

  const getMyRating = async (productId) => {
    if (!token) return null;
    const data = await apiGet(`/products/${productId}/my-rating`, token);
    return data.rating;
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

  const checkout = async (shipping, paymentMethod = 'cod') => {
    if (!token) throw new Error('Please log in to checkout');
    const data = await apiPost('/orders/checkout', { shipping, paymentMethod }, token);
    setCart([]);
    return data.order;
  };

  const createStripePayment = async (shipping) => {
    if (!token) throw new Error('Please log in to checkout');
    const data = await apiPost('/orders/create-payment', { shipping }, token);
    return data;
  };

  const confirmStripePayment = async (orderId) => {
    if (!token) throw new Error('Please log in to checkout');
    const data = await apiPost(`/orders/${orderId}/confirm-payment`, {}, token);
    setCart([]);
    return data.order;
  };

  const cancelStripePayment = async (orderId) => {
    if (!token) throw new Error('Please log in to checkout');
    const data = await apiPost(`/orders/${orderId}/cancel-payment`, {}, token);
    return data.order;
  };

  const fetchOrders = useCallback(async () => {
    if (!token) return [];
    const data = await apiGet('/orders', token);
    return data.orders || [];
  }, [token]);

  const subtotal = useMemo(() => getCartTotal(cart), [cart]);

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
      setIsCartOpen,
      addToCart,
      toggleWishlist,
      removeFromCart,
      updateQuantity,
      checkout,
      createStripePayment,
      confirmStripePayment,
      cancelStripePayment,
      fetchOrders,
      login,
      register,
      logout,
      rateProduct,
      getMyRating,
      subtotal,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
