/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  currentEmployee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employee',
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
      state.error = null;
      state.currentEmployee = {
        ...action.payload.employee,
        accessToken: action.payload.accessToken,
      };
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.currentEmployee = null;
      state.error = null;
    },
    clearError: (state, action) => {
      state.loading = false;
      state.error = null;
    },
  },
});
export default employeeSlice.reducer;

export const {
  requestStarted,
  loginSuccess,
  requestFailed,
  logoutSuccess,
  clearError,
} = employeeSlice.actions;
const loginUrl = '/employee/login';
const logoutUrl = '/employee/logout';

export const loginRequest = formInput => {
  return apiCallBegan({
    url: loginUrl,
    method: 'post',
    data: formInput,
    onStart: requestStarted.type,
    onSuccess: loginSuccess.type,
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
