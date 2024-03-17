/*
1.取得Auth上下文
2.檢查user資料確認有效身分方可響應相應頁面，否則利用Navigate搭配useLocation轉址到上一頁。
*/
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {
  const { currentEmployee, loading } = useSelector(state => state.employee);
  const location = useLocation();
  if (loading) {
    return <div>載入中...</div>;
  }

  //如果currentEmployee.accessToken不存在轉址到登入頁面
  if (!currentEmployee || !currentEmployee.accessToken) {
    return <Navigate to='/login' state={{ from: location }} replace></Navigate>;
  }

  return children;
};
