import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (userData: { username: string; email: string; password: string; name: string; bio?: string }) => Promise<void>;
  logout: () => void;
  loginAsDemoUser: (username: string) => Promise<void>;
  updateCurrentUserState: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('social_app_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Session expired or invalid token', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (emailOrUsername: string, password: string) => {
    const data: AuthResponse = await authAPI.login(emailOrUsername, password);
    localStorage.setItem('social_app_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (userData: { username: string; email: string; password: string; name: string; bio?: string }) => {
    const data: AuthResponse = await authAPI.register(userData);
    localStorage.setItem('social_app_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const loginAsDemoUser = async (username: string) => {
    await login(username, 'password123');
  };

  const logout = () => {
    localStorage.removeItem('social_app_token');
    setToken(null);
    setUser(null);
  };

  const updateCurrentUserState = (updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loginAsDemoUser,
        updateCurrentUserState,
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
