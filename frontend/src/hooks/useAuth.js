import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const { user, token, login, signup, logout, authLoading } = useApp();
  
  return {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    authLoading,
  };
};

export default useAuth;
