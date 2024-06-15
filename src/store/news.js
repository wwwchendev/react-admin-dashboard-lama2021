/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const newsSlice = createSlice({
  name: 'news',
  initialState: initialState,
  reducers: {
    requestNewsStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestNewsSuccess: (state, action) => {
      // console.log(data);
      state.loading = false;
      state.data = action.payload.data;
    },
    requestNewsFailed: (state, action) => {
      // console.log(action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    clearNewsError: (state, action) => {
      state.error = null;
    },
    addNewsSuccess: (state, action) => {
      state.data.push(action.payload.data);
      state.loading = false;
    },
    updateNewsSuccess: (state, action) => {
      const updatedData = action.payload.data;
      const index = state.data.findIndex(item => item._id === updatedData._id);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedData,
        };
      }
      state.loading = false;
    },
    deleteNewsSuccess: (state, action) => {
      const deletedData = action.payload.data;
      const updatedData = state.data.filter(
        item => item._id !== deletedData._id,
      );
      state.data = updatedData;
      state.loading = false;
    },
  },
});

export default newsSlice.reducer;
export const {
  requestNewsStarted,
  requestNewsSuccess,
  requestNewsFailed,
  clearNewsError,
  addNewsSuccess,
  updateNewsSuccess,
  deleteNewsSuccess,
} = newsSlice.actions;

const apiPath = '/news';

export const getNews = TOKEN => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/all`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestNewsStarted.type,
    onSuccess: requestNewsSuccess.type,
    onError: requestNewsFailed.type,
  });
};
export const addNews = (TOKEN, data) => {
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestNewsStarted.type,
    onSuccess: addNewsSuccess.type,
    onError: requestNewsFailed.type,
  });
};
export const updateNews = (TOKEN, id, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/${id}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestNewsStarted.type,
    onSuccess: updateNewsSuccess.type,
    onError: requestNewsFailed.type,
  });
};
export const deleteNews = (TOKEN, id) => {
  return apiCallBegan({
    url: `${apiPath}/${id}`,
    method: 'delete',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestNewsStarted.type,
    onSuccess: deleteNewsSuccess.type,
    onError: requestNewsFailed.type,
  });
};
export const newsRequests = {
  getAll: getNews,
  add: addNews,
  update: updateNews,
  delete: deleteNews,
};
