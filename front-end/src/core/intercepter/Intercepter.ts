import axios from 'axios';
import { API_ENDPOINT } from '@/utils/constants/constants';

export const baseUrl =
  localStorage.getItem('apiUrl') ||
  'http://localhost:3002/api/v1';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 100000,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const authDataString = localStorage.getItem('auth');
    const authData = authDataString ? JSON.parse(authDataString) : null;
    let token = authData?.token;

    config.headers['Authorization'] = `Bearer ${token}`;
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
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;
      const { status } = error.response;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const authDataString = localStorage.getItem('auth');
        const authData = authDataString ? JSON.parse(authDataString) : null;
        const refreshToken = authData?.refreshToken;
        const response: any = await axios.post(
          API_ENDPOINT.REFRESH_TOKEN,
          {},
          {
            baseURL: baseUrl,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );
        const token = response.data.token;
        const updatedAuthData = {
          ...authData,
          refreshToken: response.data.refreshToken,
          token: response.data.token,
          tokenExpires: response.data.tokenExpires,
        };
        localStorage.setItem('auth', JSON.stringify(updatedAuthData));

        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      }

      if (status === 403) {
        console.log('Access denied');
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
