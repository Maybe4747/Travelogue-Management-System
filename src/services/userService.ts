import axios from './axios';
import type { User } from '../types';

// 登录
export const login = async (
  nickname: string,
  password: string
): Promise<User> => {
  try {
    const response = await axios.post('/login', { nickname, password });
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 获取用户信息
export const getUserInfo = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`/user?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};
