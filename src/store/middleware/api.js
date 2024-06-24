import axios from 'axios';
import { apiCallBegan } from '@/store/api';
import { jwtDecode } from 'jwt-decode';
import { AuthRequests, reset } from '@/store/authEmployee';

const api = store => next => async action => {
  if (action.type !== apiCallBegan.type) {
    return next(action);
  }
  const { dispatch, getState } = store;
  const { url, method, data, onStart, onSuccess, onError, headers } =
    action.payload;

  const requestConfig = {
    baseURL: import.meta.env.VITE_APIURL,
    url,
    method,
    data,
    headers: headers || {},
  };
  if (headers) {
    //取得token和有效期限
    const accessToken = getState().authEmployee.data.accessToken;
    const refreshToken = getState().authEmployee.data.refreshToken;
    const decodedAccessToken = jwtDecode(accessToken);
    // {type: 'employee', id: '11304001', iat: 1715838569, exp: 1715852969}

    // 判斷TOKEN是否過期，自動請求refresh
    const currentDate = Math.floor(Date.now() / 1000);
    const refreshUrl = "/auth/refreshToken/employee"
    if (decodedAccessToken.exp < currentDate && url !== refreshUrl) {

      await dispatch(AuthRequests.refreshToken({ refreshToken: refreshToken }));
      const newAccessToken = getState().authEmployee.data.accessToken;

      requestConfig.headers.authorization = `Bearer ${newAccessToken}`;
    }
    // console.log(
    // 'TOKEN狀態',
    // decodedAccessToken,
    //   {
    //     "發放時間": new Date(decodedAccessToken.iat * 1000).toLocaleString(),
    //     "有效時間": new Date(decodedAccessToken.exp * 1000).toLocaleString()
    //   }
    // );
  }
  if (onStart) dispatch({ type: onStart });

  try {
    const response = await axios.request(requestConfig);
    dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    console.log(error)
    if (error.response.data.errors.token === 'jwt expired') {
      console.log('過期處理');
    }

    if (error.response.data.message === "刷新驗證令牌失敗") {
      alert('令牌失效，請重新登入')
      store.dispatch({ type: 'RESET' });
      return
    };

    // console.log('API中間件捕捉錯誤:', `${requestConfig.baseURL}${requestConfig.url}`, error.response.data);
    //存store錯誤
    dispatch({ type: onError, payload: error.response.data });
    //打印錯誤
    dispatch({ type: 'SHOW_ERROR', payload: error.response.data });
  }
};

export default api;
