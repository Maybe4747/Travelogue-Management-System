import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import MainView from './pages/main-view';
import LoginForm from './pages/auth/login';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<MainView />} />
            <Route path="/pending" element={<MainView />} />
            <Route path="/approved" element={<MainView />} />
            <Route path="/rejected" element={<MainView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  </ConfigProvider>
);
