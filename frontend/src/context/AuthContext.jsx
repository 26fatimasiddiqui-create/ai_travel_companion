import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('travel_companion_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('travel_companion_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('travel_companion_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res && res.data) {
      const { token, ...userData } = res.data;
      localStorage.setItem('travel_companion_token', token);
      setToken(token);
      setUser(userData);
      return userData;
    }
  };

  const register = async (email, password, fullName, travelPreferences) => {
    const res = await authService.register({ email, password, fullName, travelPreferences });
    if (res && res.data) {
      const { token, ...userData } = res.data;
      localStorage.setItem('travel_companion_token', token);
      setToken(token);
      setUser(userData);
      return userData;
    }
  };

  const loginAsDemo = async () => {
    return login('demo@travelcompanion.ai', 'password123');
  };

  const logout = () => {
    localStorage.removeItem('travel_companion_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
