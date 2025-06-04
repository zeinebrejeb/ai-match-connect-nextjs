import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!API_URL) {
  console.error(
    'NEXT_PUBLIC_BACKEND_API_URL is not defined. Please check your .env.local file. Falling back to a default, but this may not work.'
  );
}

const api = axios.create({
  baseURL: API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void; config: InternalAxiosRequestConfig }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.config.headers.Authorization = `Bearer ${token}`;
      prom.resolve(api(prom.config)); 
    } else {
      
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers && !config.headers.Authorization) { 
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; 

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.warn("API Interceptor: No refresh token available. User must log in.");
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user'); 
      
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth?type=login'; 
          }
        }
        return Promise.reject(error); 
      }

      if (isRefreshing) {
        console.log("API Interceptor: Token refresh in progress. Queuing request.");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      
      }

      isRefreshing = true;
      console.log("API Interceptor: Attempting to refresh token with:", refreshToken.substring(0, 20) + "..."); 

      try {
        const refreshPayload = { refresh: refreshToken }; 
        console.log("API Interceptor: Sending refresh token request to:", `${api.defaults.baseURL}/auth/token/refresh/`, "with payload:", refreshPayload);

        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/token/refresh/`, 
          refreshPayload,
          { headers: { 'Content-Type': 'application/json' } } 
        );

        console.log("API Interceptor: Token refresh successful. Response data:", refreshResponse.data);
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) { 
            localStorage.setItem('refreshToken', newRefreshToken);
            console.log("API Interceptor: New refresh token stored.");
          } else {
            console.log("API Interceptor: Existing refresh token remains valid.");
          }


          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
   
          if(originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken); 
          return api(originalRequest); 
        } else {
          console.error("API Interceptor: Refresh token failed: New access token not received.");
          throw new Error("Refresh token failed: New access token not received."); 
        }
      } catch (refreshError: any) {
        console.error("API Interceptor: Token refresh API call failed:", refreshError.response?.data || refreshError.message);
        processQueue(refreshError as AxiosError, null); 
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
       
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth?type=login';
          }
        }
        return Promise.reject(refreshError); 
      } finally {
        isRefreshing = false;
        console.log("API Interceptor: isRefreshing set to false.");
      }
    }
    return Promise.reject(error); 
  }
);

export default api;