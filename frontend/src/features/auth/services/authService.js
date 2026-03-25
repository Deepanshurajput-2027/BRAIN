import axiosInstance from '../../../shared/api/axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/users/login', credentials);
  return response.data.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/users/register', userData);
  return response.data.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/users/logout');
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data.data;
};
export const updateProfile = async (userData) => {
  const response = await axiosInstance.patch('/users/update-profile', userData);
  return response.data.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/users/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(`/users/reset-password/${token}`, { password });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(`/users/verify-email/${token}`);
  return response.data;
};

export const sendVerification = async () => {
  const response = await axiosInstance.post('/users/send-verification');
  return response.data;
};
