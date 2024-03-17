import axios from 'axios';
import { apiCallBegan } from '@/store/api';

const api = store => next => async action => {
  if (action.type !== apiCallBegan.type) {
    return next(action);
  }
  const { dispatch } = store;
  const { url, method, data, onStart, onSuccess, onError, headers } =
    action.payload;

  const requestConfig = {
    baseURL: import.meta.env.VITE_APIURL,
    url,
    method,
    data,
  };
  console.log(`${requestConfig.baseURL}${requestConfig.url}`);
  if (headers) {
    requestConfig.headers = headers;
  }
  if (onStart) dispatch({ type: onStart });

  try {
    const response = await axios.request(requestConfig);
    dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({ type: onError, payload: error.response.data });
    dispatch({ type: 'SHOW_ERROR', payload: error.response.data });
  }
};

export default api;
