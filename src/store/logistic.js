/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const logisticSlice = createSlice({
  name: 'Logistic',
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
    requestLogisticsSuccess: (state, action) => {
      state.loading = false;
      // console.log(action.payload.data);
      state.data = action.payload.data;
    },
    addLogisticSuccess: (state, action) => {
      state.loading = false;
      state.data.unshift(action.payload.data);
    },
    updateLogisticSuccess: (state, action) => {
      const updatedData = action.payload.data;
      // console.log(action.payload);
      const index = state.data.findIndex(
        item => item.logisticNumber === updatedData.logisticNumber,
      );
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedData,
        };
      }
      state.loading = false;
    },
    clearLogisticError: (state, action) => {
      state.error = null;
    },
  },
});
export default logisticSlice.reducer;

export const {
  requestStarted,
  requestFailed,
  requestLogisticsSuccess,
  addLogisticSuccess,
  updateLogisticSuccess,
  clearLogisticError,
} = logisticSlice.actions;

const apiPath = '/logistic';
export const getLogistics = TOKEN => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/all`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: requestLogisticsSuccess.type,
    onError: requestFailed.type,
  });
};
export const addLogistic = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: addLogisticSuccess.type,
    onError: requestFailed.type,
  });
};
export const updateLogistic = (TOKEN, logisticNumber, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/${logisticNumber}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: updateLogisticSuccess.type,
    onError: requestFailed.type,
  });
};

export const logisticRequests = {
  getAll: getLogistics,
  create: addLogistic,
  update: updateLogistic,
};
