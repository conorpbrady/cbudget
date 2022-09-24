import axios from 'axios';
import Cookie from 'js-cookie';

const baseUrl = 'https://localhost:8000/api/';

const csrfToken = Cookie.get('csrftoken');

const axiosConfig = {
  baseUrl: 'http://localhost:8000/api/',
  timeout: 5000,
  headers: {
    Authorization: 'JWT ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
    accept: 'application/json',
    'X-CSRFToken': csrfToken,
  },
};
const axiosInstance = axios.create(axiosConfig);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const errorStatus = error.response.status;
    const errorDetails = error.response.data.errors.reduce(
      (obj, item) => ((obj[item.field] = item.message), obj),
      {}
    );

    // If refresh token is not valid redirect to login page
    if (
      errorDetails.code === 'token_not_valid' &&
      errorStatus === 401 &&
      originalRequest.url === baseUrl + '/api/token/refresh'
    ) {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // If token verify request fails - reject - used to check if user is authenticated
    if (errorStatus === 400 && originalRequest.url === '/api/token/verify') {
      return Promise.reject(error);
    }

    if (errorStatus === 401 && originalRequest.url === '/api/token/verify') {
      return Promise.reject(error);
    }

    // Refresh token is expired - Refresh the token
    if (
      errorDetails.code === 'token_not_valid' &&
      errorStatus === 401 &&
      error.response.statusText === 'Unauthorized' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }

      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          originalRequest._retry = true;
          isRefreshing = true;
          return new Promise((resolve, reject) => {
            axiosInstance
              .post('/api/token/refresh/', { refresh: refreshToken })
              .then((response) => {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);

                axiosInstance.defaults.headers['Authorization'] =
                  'JWT ' + response.data.access;
                originalRequest.headers['Authorization'] =
                  'JWT ' + response.data.access;
                processQueue(null, response.token);
                resolve(axiosInstance(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else {
          console.log('Refresh token is expired', tokenParts.exp);
          window.location.href = '/login/';
        }
      } else {
        console.log('Refresh token not avaliable.');
        window.location.href = '/login/';
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
