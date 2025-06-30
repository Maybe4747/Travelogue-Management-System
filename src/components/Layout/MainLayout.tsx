import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items: MenuProps['items'] = [
    {
      key: '/',
      icon: <FileTextOutlined />,
      label: '全部游记',
    },
    {
      key: '/pending',
      icon: <FieldTimeOutlined />,
      label: '待审核游记',
    },
    {
      key: '/approved',
      icon: <CheckCircleOutlined />,
      label: '已通过游记',
    },
    {
      key: '/rejected',
      icon: <CloseCircleOutlined />,
      label: '未通过游记',
    },
  ];

  const dropdownItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sider（侧边栏） */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{ backgroundColor: '#fff' }}
        className="bg-white">
        <div className="h-16 flex items-center justify-center bg-blue-600 text-white font-bold">
          {!collapsed ? '游记管理系统' : '游记'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => handleMenuClick(key)}
          items={items}
          className="border-r-0"
        />
      </Sider>
      {/* Layout（主内容区域） */}
      <Layout style={{ backgroundColor: '#f5f5f5' }}>
        {/* Header（头部） */}
        <Header
          className="bg-white p-0 flex justify-between items-center px-4"
          style={{ backgroundColor: '#fff' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="text-lg"
          />
          <div className="flex items-center">
            <span className="mr-3">
              {user.role === UserRole.ADMIN ? '管理员' : '审核人员'}:{' '}
              {user.user_info.nickname}
            </span>
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="cursor-pointer" />
            </Dropdown>
          </div>
        </Header>
        {/* Content（内容区域） */}
        <Content className="m-4 p-6 bg-white rounded">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
