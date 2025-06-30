import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from '../services/userService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null; // 用户信息
  loading: boolean;// 加载状态
  login: (userId: string, token: string) => Promise<void>;
  logout: () => void;  // 登出方法
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (token && userId) {
      fetchUserInfo(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (userId: string) => {
    try {
      const userData = await getUserInfo(userId);
      setUser(userData);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId: string, token: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);

    await fetchUserInfo(userId);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
