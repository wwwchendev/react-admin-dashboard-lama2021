/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: null,
  loading: false,
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
      state.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.data = {
        ...action.payload.employee,
        accessToken: action.payload.accessToken,
      };
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.data = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    clearError: (state, action) => {
      state.loading = false;
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
  updatePasswordSuccess,
  clearError,
} = AuthEmployeeSlice.actions;

const apiPath = '/authEmployee';
export const loginRequest = formInput => {
  return apiCallBegan({
    url: `${apiPath}/login`,
    method: 'post',
    data: formInput,
    onStart: requestStarted.type,
    onSuccess: loginSuccess.type,
    onError: requestFailed.type,
  });
};

export const logoutRequest = () => {
  return apiCallBegan({
    url: `${apiPath}/logout`,
    method: 'post',
    onStart: requestStarted.type,
    onSuccess: logoutSuccess.type,
    onError: requestFailed.type,
  });
};
export const updatePasswordRequest = (TOKEN, employeeId, data) => {
  return apiCallBegan({
    url: `${apiPath}/changePassword/${employeeId}`,
    method: 'put',
    data: data,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: updatePasswordSuccess.type,
    onError: requestFailed.type,
  });
};

export const AuthRequests = {
  login: loginRequest,
  logout: logoutRequest,
  updatePassword: updatePasswordRequest
};
