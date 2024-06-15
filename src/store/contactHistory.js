/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const contactHistorySlice = createSlice({
  name: 'contactHistory',
  initialState: initialState,
  reducers: {
    requestContactHistoryStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestContactHistorySuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
    },
    requestContactHistoryFailed: (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    addContactHistorySuccess: (state, action) => {
      state.data.unshift(action.payload.data);
      state.loading = false;
    },
    deleteContactHistorySuccess: (state, action) => {
      const deletedData = action.payload.data;
      const updatedData = state.data.filter(
        item => item.caseNumber !== deletedData.caseNumber,
      );
      state.data = updatedData;
      state.loading = false;
    },
    updateContactHistorySuccess: (state, action) => {
      const updatedRecord = action.payload.data;
      const index = state.data.findIndex(
        item => item.caseNumber === updatedRecord.caseNumber,
      );
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedRecord,
        };
      }
      state.loading = false;
    },
    clearContactHistoryError: (state, action) => {
      state.error = null;
    },
  },
});
export default contactHistorySlice.reducer;

export const {
  requestContactHistoryStarted,
  requestContactHistorySuccess,
  requestContactHistoryFailed,
  addContactHistorySuccess,
  updateContactHistorySuccess,
  deleteContactHistorySuccess,
  clearContactHistoryError,
} = contactHistorySlice.actions;

const apiPath = '/contactHistory';

export const getContactHistory = TOKEN => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/all`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestContactHistoryStarted.type,
    onSuccess: requestContactHistorySuccess.type,
    onError: requestContactHistoryFailed.type,
  });
};
export const addContactHistory = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'post',
    data: { ...data },
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestContactHistoryStarted.type,
    onSuccess: addContactHistorySuccess.type,
    onError: requestContactHistoryFailed.type,
  });
};
export const deleteContactHistory = (TOKEN, caseNumber) => {
  return apiCallBegan({
    url: `${apiPath}/${caseNumber}`,
    method: 'delete',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestContactHistoryStarted.type,
    onSuccess: deleteContactHistorySuccess.type,
    onError: requestContactHistoryFailed.type,
  });
};
export const updateContactHistory = (TOKEN, caseNumber, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/${caseNumber}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestContactHistoryStarted.type,
    onSuccess: updateContactHistorySuccess.type,
    onError: requestContactHistoryFailed.type,
  });
};
export const contactHistoryRequests = {
  getAll: getContactHistory,
  add: addContactHistory,
  update: updateContactHistory,
  delete: deleteContactHistory,
};
