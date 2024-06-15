/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';
const initialState = {
  data: {},
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: 'File',
  initialState: initialState,
  reducers: {
    requestStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    requestFileSuccess: (state, action) => {
      state.data = action.payload.data;
      state.loading = false;
    },
    uploadSuccess: (state, action) => {
      const {
        buffer,
        encoding,
        fieldname,
        imageUrl,
        mimetype,
        originalname,
        size,
      } = action.payload.data;
      state.data = {
        encoding,
        fieldname,
        imageUrl,
        mimetype,
        originalname,
        size,
      };
      state.loading = false;
    },
    uploadFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    initFileState: (state, action) => {
      state.data = {};
      state.error = null;
    },
  },
});
export default fileSlice.reducer;

export const {
  requestStarted,
  requestFailed,
  requestFileSuccess,
  uploadSuccess,
  uploadFailed,
  initFileState,
} = fileSlice.actions;

const apiPath = '/file';
export const getFiles = TOKEN => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: requestFileSuccess.type,
    onError: requestFailed.type,
  });
};
export const resetFolder = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/reset`,
    method: 'delete',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: initFileState.type,
    onError: requestFailed.type,
  });
};

export const fileRequests = {
  getAll: getFiles,
  resetFolder: resetFolder,
};
