import axios from 'axios';
import loginApi from '@/api/loginApi';

const axiosInstance = axios.create({
  baseURL: 'http://10.10.150.69:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const authDataString = localStorage.getItem('auth');
    const authData = authDataString ? JSON.parse(authDataString) : null;
    let token = authData?.token;
    const refreshToken = authData?.refreshToken;
    const tokenExpires = authData?.tokenExpires;

    const currentTime = Math.floor(Date.now() / 1000);

    if (
      token &&
      tokenExpires &&
      currentTime >= Math.floor(Number(tokenExpires) / 1000)
    ) {
      try {
        const response = await loginApi.postRefreshToken({ refreshToken });

        token = response.data.token;
        const newTokenExpires = response.data.tokenExpires;

        const updatedAuthData = {
          ...authData,
          token,
          tokenExpires: newTokenExpires,
        };
        localStorage.setItem('auth', JSON.stringify(updatedAuthData));

        config.headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('auth');

        return Promise.reject(error);
      }
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('auth');
      }

      if (status === 403) {
        console.log('Access denied');
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
