import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let requests: Array<(token: string) => void> = [];

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // 防止无限循环
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            // 调用刷新 token 接口
            const res = await axios.post('http://localhost:3001/api/refresh', {
              refresh_token: refreshToken,
            });
            const newToken = res.data.access_token;
            localStorage.setItem('access_token', newToken);
            isRefreshing = false;

            // 重新执行所有挂起的请求
            requests.forEach((cb) => cb(newToken));
            requests = [];

            // 重新设置 Authorization 并重试原请求
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (err) {
            isRefreshing = false;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(err);
          }
        } else {
          // 正在刷新，挂起请求
          return new Promise((resolve) => {
            requests.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            //  用新 token 再发一次刚才失败的请求
              resolve(instance(originalRequest));
            });
          });
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    if (error.response) {
      // 处理错误响应
      switch (error.response.status) {
        case 403:
          // 权限不足
          console.error('没有权限访问该资源');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        default:
          console.error('服务器错误');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
