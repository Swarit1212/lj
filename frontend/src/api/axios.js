import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

instance.interceptors.request.use((req) => {
  try {
    const rawUser = localStorage.getItem('UserInfo');
    if (rawUser && rawUser !== 'undefined') {
      const user = JSON.parse(rawUser);
      if (user && user.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.warn('Axios interceptor token parse error:', err);
  }
  return req;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('UserInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;