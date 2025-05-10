import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { login } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();
  const [form] = Form.useForm();

  // 检查是否已登录
  useEffect(() => {
    if (user) {
      message.info('您已登录，请先退出登录');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (values: {
    nickname: string;
    password: string;
  }) => {
    // 如果已经登录，不允许再次登录
    if (user) {
      message.warning('您已登录，请先退出登录');
      return;
    }

    try {
      const response = await login(values.nickname, values.password);
      if (response.success) {
        // 保存 token
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('refresh_token', response.token); // 如果需要的话

        // 更新认证状态
        await authLogin(response.user_id, response.token);

        message.success(response.message || '登录成功');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error(
        error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
      );
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={handleSubmit}
      autoComplete="off"
      layout="vertical">
      <Form.Item
        name="nickname"
        rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
