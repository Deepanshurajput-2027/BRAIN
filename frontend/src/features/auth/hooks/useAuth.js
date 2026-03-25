import { useSelector, useDispatch } from 'react-redux';
import { loginUser, setLogout, clearError } from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  };

  const logout = () => {
    dispatch(setLogout());
    // Clear cookies/tokens if needed, though logout service would be better
  };

  const resetError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading: status === 'loading',
    error,
    login,
    logout,
    resetError,
  };
};

export default useAuth;
