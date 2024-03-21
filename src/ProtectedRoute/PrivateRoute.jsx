/*
1.取得Auth上下文
2.檢查user資料確認有效身分方可響應相應頁面，否則利用Navigate搭配useLocation轉址到上一頁。
*/
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


//登入才能檢視
export const PrivateRoute = ({ children }) => {
  const { data, loading, error } = useSelector(state => state.authEmployee);
  const location = useLocation();
  if (loading === true && data === null) {
    console.log(loading);
    return <div>載入中0...</div>;
  }
  //如果currentEmployee.accessToken不存在轉址到登入頁面
  if (!data) {
    return <Navigate to='/login' state={{ from: location }} replace></Navigate>;
  }

  return children;
};

export const RedirectIfLoggedIn = ({ children }) => {
  const { data, loading, error } = useSelector(state => state.authEmployee);
  const location = useLocation();

  if (loading) {
    return <div>載入中1...</div>;
  }
  if (data && data.accessToken) {
    return <Navigate to='/' state={{ from: location }} replace></Navigate>;
  }

  return children;
};

//是主管才能檢視
export const RedirectIfSupervisor = ({ children }) => {
  const { data, loading, error } = useSelector(state => state.authEmployee);
  const location = useLocation();
  if (loading) {
    return <div>載入中2...</div>;
  }
  //如果currentEmployee.accessToken不存在轉址到登入頁面
  if (!data || data.role !== '主管') {
    return <Navigate to={location.state?.from || '/'} replace></Navigate>;
  }

  return children;
};