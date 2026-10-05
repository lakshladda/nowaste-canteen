import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nowaste_token');
      const savedUser = localStorage.getItem('nowaste_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh profile in background
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('nowaste_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.error('Session expired:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('nowaste_token', data.token);
      localStorage.setItem('nowaste_user', JSON.stringify(data.user));
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}! 🌱`, 'success');
      return data.user;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      localStorage.setItem('nowaste_token', data.token);
      localStorage.setItem('nowaste_user', JSON.stringify(data.user));
      setUser(data.user);
      showToast(`Account created! You received 20 welcome points. 🥉`, 'success');
      return data.user;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('nowaste_token');
    localStorage.removeItem('nowaste_user');
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  // Demo shortcut login helper
  const loginDemo = async (role = 'student') => {
    if (role === 'admin' || role === 'canteen_admin') {
      return await login('canteen@nowaste.com', 'canteen123');
    } else {
      return await login('student@nowaste.com', 'student123');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('nowaste_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Failed to refresh user points:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginDemo,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'canteen_admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
