import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { apiPost } from '../services/api';
import {
  ADMIN_AUTH_KEYS,
  clearSession,
  getStoredSession,
  saveAuthSession,
  subscribeAuthChanges,
} from '../services/authStorage';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => getStoredSession(ADMIN_AUTH_KEYS));
  const [loading, setLoading] = useState(false);

  useEffect(() => subscribeAuthChanges((session, nextAuth) => {
    if (session === 'admin') {
      setAdmin(nextAuth);
    }
  }), []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiPost('/auth/admin/login', { email, password });
      const next = saveAuthSession('admin', data);
      flushSync(() => {
        setAdmin(next);
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession(ADMIN_AUTH_KEYS);
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
