import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/userService';

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { nickname: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values.nickname, values.password);
      if (response.token && response.user_id) {
        await authLogin(response.user_id, response.token);
        message.success('登录成功');
        navigate('/');
      } else {
        message.error('登录失败：返回数据格式错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      const errorMessage =
        error instanceof Error ? error.message : '登录失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>登录</Title>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical">
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: '请输入用户名' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
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
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}>
              登录
            </Button>
            <div className="text-center text-sm text-gray-500">
          <div>管理员：admin1 密码：admin123</div>
          <div>审核员：reviewer1 密码：reviewer123</div>
          <p className="text-gray-500 mt-2">仅管理员和审核员可登录</p>
        </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
