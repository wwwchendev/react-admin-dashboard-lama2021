/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    requestStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    requestFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.data = null;
    },
  },
});
export default userSlice.reducer;

const { requestStarted, requestSuccess, requestFailed, logoutSuccess } =
  userSlice.actions;
const loginUrl = '/user/login';
const logoutUrl = '/user/logout';

export const loginRequest = formInput => {
  return apiCallBegan({
    url: loginUrl,
    method: 'post',
    data: formInput,
    onStart: requestStarted.type,
    onSuccess: requestSuccess.type,
    onError: requestFailed.type,
  });
};

export const logoutRequest = () => {
  return apiCallBegan({
    url: logoutUrl,
    method: 'post',
    onStart: requestStarted.type,
    onSuccess: logoutSuccess.type,
    onError: requestFailed.type,
  });
};

export const AuthRequests = {
  login: loginRequest,
  logout: logoutRequest,
};
