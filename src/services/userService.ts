import { AxiosError } from 'axios';
import type { User, LoginResponse } from '../types';
import { UserRole } from '../types';
import instance from './axios';

// 登录
export const login = async (
  nickname: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await instance.post('/login', {
      nickname: nickname,
      password: password,
    });

    const { data, message, success } = response.data;

    if (!success) {
      throw new Error(message || '登录失败');
    }

    // 检查用户角色
    if (data.role !== UserRole.ADMIN && data.role !== UserRole.REVIEWER) {
      alert('只有管理员和审核员可以登录系统');
      throw new Error('只有管理员和审核员可以登录系统');
    }

    return {
      token: data.access_token,
      user_id: data.user_id,
      role: data.role,
      message: message,
      success: success,
    };
  } catch (error) {
    console.error('登录失败:', error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        alert('用户名或密码错误');
        throw new Error('用户名或密码错误');
      } else if (error.response?.status === 400) {
        alert('缺少昵称或密码');
        throw new Error('缺少昵称或密码');
      }
    }
    alert('登录失败，请稍后重试');
    throw error;
  }
};

// 获取用户信息
export const getUserInfo = async (userId: string): Promise<User> => {
  if (!userId) {
    throw new Error('用户ID不能为空');
  }

  try {
    const response = await instance.get(`/user?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};
