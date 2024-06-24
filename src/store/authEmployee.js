/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const AuthEmployeeSlice = createSlice({
  name: 'AuthEmployee',
  initialState: initialState,
  reducers: {
    requestStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestFailed: (state, action) => {
      state.loading = false;
      const data = action.payload.errors;
      console.log(action.payload)
      state.error = data;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = { ...data };
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.data = null;
    },
    refreshTokenSuccess: (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      // {
      //   "type": "employee",
      //   "id": "11304001",
      //   "accessToken": "eyJhb.."
      // }
      state.data = {
        ...state.data,
        accessToken: data.accessToken,
      };
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
    },
    forgetPasswordSuccess: (state, action) => {
      state.loading = false;
      const data = action.payload;
      state.data = { 'message': data.message };
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      const data = action.payload;
      state.data = { 'message': data.message };
    },
    reset: (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
});
export default AuthEmployeeSlice.reducer;

export const {
  requestStarted,
  requestFailed,
  loginSuccess,
  logoutSuccess,
  refreshTokenSuccess,
  updatePasswordSuccess,
  forgetPasswordSuccess,
  resetPasswordSuccess,
  reset,
} = AuthEmployeeSlice.actions;

export const loginRequest = data => {
  return apiCallBegan({
    url: `/auth/login/employee`,
    method: 'post',
    data: data,
    onStart: requestStarted.type,
    onSuccess: loginSuccess.type,
    onError: requestFailed.type,
  });
};
export const logoutRequest = refreshToken => {
  // console.log(refreshToken);
  return apiCallBegan({
    url: `/auth/logout/employee`,
    method: 'delete',
    data: { refreshToken },
    onStart: requestStarted.type,
    onSuccess: logoutSuccess.type,
    onError: requestFailed.type,
  });
};
export const refreshTokenRequest = (data) => {
  console.log('TOKEN過期，自動請求更新');
  return apiCallBegan({
    url: `/auth/refreshToken/employee`,
    method: 'post',
    data: { refreshToken: data.refreshToken },
    onStart: requestStarted.type,
    onSuccess: refreshTokenSuccess.type,
    onError: requestFailed.type,
  });
};
export const updatePasswordRequest = (TOKEN, data) => {
  return apiCallBegan({
    url: `/auth/updatePassword/employee`,
    method: 'patch',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: updatePasswordSuccess.type,
    onError: requestFailed.type,
  });
};
export const forgetPasswordRequest = data => {
  return apiCallBegan({
    url: `/auth/forgetPassword/employee`,
    method: 'post',
    data: data,
    onStart: requestStarted.type,
    onSuccess: forgetPasswordSuccess.type,
    onError: requestFailed.type,
  });
};
export const resetPasswordRequest = (resetPasswordToken, data) => {
  return apiCallBegan({
    url: `/auth/resetPassword/employee?token=${resetPasswordToken}`,
    method: 'post',
    data: data,
    onStart: requestStarted.type,
    onSuccess: resetPasswordSuccess.type,
    onError: requestFailed.type,
  });
};

export const AuthRequests = {
  login: loginRequest,
  logout: logoutRequest,
  refreshToken: refreshTokenRequest,
  updatePassword: updatePasswordRequest,
  forgetPassword: forgetPasswordRequest,
  resetPassword: resetPasswordRequest,
};
