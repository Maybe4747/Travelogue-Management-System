import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './components/AppRoutes';
import './index.css';
// const AppRoutes = () => {
//   const { user, loading } = useAuth();
//   // 如果正在加载，显示空内容
//   if (loading) {
//     return null;
//   }
//   // 如果未登录，只显示登录页面
//   if (!user) {
//     return (
//       <Routes>
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     );
//   }
//   // 已登录用户的路由
//   return (
//     <Routes>
//       <Route path="/" element={<MainView />} />
//       <Route path="/pending" element={<MainView />} />
//       <Route path="/approved" element={<MainView />} />
//       <Route path="/rejected" element={<MainView />} />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  </ConfigProvider>
);
