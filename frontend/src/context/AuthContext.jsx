import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const loginUser = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <AuthContext.Provider value={{ token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
