import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../pages/auth/login';
import MainView from '../../pages/main-view';
import { Navigate, Route, Routes } from 'react-router';

export default function AppRoutes() {
  const { user, loading } = useAuth();
  // 如果正在加载，显示空内容
  if (loading) {
    return null;
  }
  // 如果未登录，只显示登录页面
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  // 已登录用户的路由
  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/pending" element={<MainView />} />
      <Route path="/approved" element={<MainView />} />
      <Route path="/rejected" element={<MainView />} />
      {/*防止用户访问不存在的页面，自动跳转到首页或指定页面。 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
