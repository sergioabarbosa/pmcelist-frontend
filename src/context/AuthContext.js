import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('AuthContext - Token:', token);
    console.log('AuthContext - Stored User:', storedUser);
    
    if (token) {
      try {
        // For mock token
        if (token === 'mock-jwt-token' && storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext - Mock user loaded:', userData);
          setUser(userData);
        } else {
          // For real JWT token
          const decoded = jwtDecode(token);
          console.log('AuthContext - JWT decoded:', decoded);
          
          // Se temos dados do usuário salvos no localStorage, use eles
          // (pois o JWT pode não ter todas as informações como isAdmin)
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            console.log('AuthContext - Using stored user data:', userData);
            setUser(userData);
          } else {
            // Se não temos dados salvos, use só o JWT decodificado
            setUser(decoded);
          }
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData = null) => {
    console.log('AuthContext - Logging in with token:', token);
    console.log('AuthContext - User data provided:', userData);
    
    localStorage.setItem('token', token);
    
    // SEMPRE salve os dados do usuário se fornecidos
    if (userData) {
      console.log('AuthContext - Saving user data to localStorage:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return;
    }
    
    // Se não temos userData, tente decodificar o JWT
    if (token !== 'mock-jwt-token') {
      try {
        const decoded = jwtDecode(token);
        console.log('AuthContext - JWT decoded during login:', decoded);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};