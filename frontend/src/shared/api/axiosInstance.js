import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Response interceptor for handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // We let the frontend state management (Redux/App.jsx) handle 401s 
    // to avoid hard-reload infinite loops.
    return Promise.reject(error);
  }
);

export default axiosInstance;
