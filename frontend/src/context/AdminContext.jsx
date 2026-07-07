import { createContext, useContext, useEffect, useState } from 'react';
import { apiPost } from '../services/api';

const ADMIN_STORAGE_KEYS = {
  token: 'northstar-admin-token',
  user: 'northstar-admin-user',
};

const AdminContext = createContext();

const getStoredAdmin = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(ADMIN_STORAGE_KEYS.token);
  const user = localStorage.getItem(ADMIN_STORAGE_KEYS.user);
  return token && user ? { token, user: JSON.parse(user) } : null;
};

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => getStoredAdmin());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      localStorage.setItem(ADMIN_STORAGE_KEYS.token, admin.token);
      localStorage.setItem(ADMIN_STORAGE_KEYS.user, JSON.stringify(admin.user));
    }
  }, [admin]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiPost('/auth/admin/login', { email, password });
      const next = { token: data.token, user: data.user };
      localStorage.setItem(ADMIN_STORAGE_KEYS.token, data.token);
      localStorage.setItem(ADMIN_STORAGE_KEYS.user, JSON.stringify(data.user));
      setAdmin(next);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEYS.token);
    localStorage.removeItem(ADMIN_STORAGE_KEYS.user);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout, token: admin?.token }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
