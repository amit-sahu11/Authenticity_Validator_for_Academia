import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [mode, setMode] = useState('simulated');
  const [simulatedRole, setSimulatedRole] = useState('university'); // 'university' or 'recruiter'
  const [token, setToken] = useState(localStorage.getItem('auth_token') || '');
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth_user') || 'null'));

  const login = (newToken, newUser) => {
    setToken(newToken);
    setAuthUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken('');
    setAuthUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const userRole = mode === 'backend' && authUser ? authUser.role : simulatedRole;

  return (
    <AuthContext.Provider value={{ mode, setMode, simulatedRole, setSimulatedRole, userRole, token, authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

