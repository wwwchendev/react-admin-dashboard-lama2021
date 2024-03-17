import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const loginRecordSlice = createSlice({
  name: 'product',
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
  }
})
export default loginRecordSlice.reducer;
const { requestStarted, requestSuccess, requestFailed } =
  loginRecordSlice.actions;

const apiPath = '/loginRecord';
const employee = JSON.parse(localStorage.getItem('persist:root'))?.employee;
const currentEmployee = employee && JSON.parse(employee).currentEmployee;
const TOKEN = currentEmployee?.accessToken;

export const getRecords = () => {
  return apiCallBegan({
    url: `${apiPath}/all`,
    method: 'get',
    data: null,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: requestSuccess.type,
    onError: requestFailed.type,
  });
};

export const loginRecordRequests = {
  getAll: getRecords,
};
