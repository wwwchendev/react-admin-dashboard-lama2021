import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const RedirectIfLoggedIn = ({ children }) => {
  const { currentEmployee, loading } = useSelector(state => state.employee);
  const location = useLocation();

  if (loading) {
    return <div>載入中...</div>;
  }
  if (currentEmployee && currentEmployee.accessToken) {
    return <Navigate to='/' state={{ from: location }} replace></Navigate>;
  }

  return children;
};
