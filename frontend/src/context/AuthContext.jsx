import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('naturalis_token');
      const savedUser = localStorage.getItem('naturalis_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with server in background
          const profile = await api.getProfile();
          setUser(profile);
          localStorage.setItem('naturalis_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Token expired or invalid, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('naturalis_token', data.token);
    const userInfo = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      address: data.address,
    };
    localStorage.setItem('naturalis_user', JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('naturalis_token', data.token);
    const userInfo = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      address: data.address,
    };
    localStorage.setItem('naturalis_user', JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  };

  const logout = () => {
    localStorage.removeItem('naturalis_token');
    localStorage.removeItem('naturalis_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('naturalis_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
