/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'User',
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
    requestUsersSuccess: (state, action) => {
      state.loading = false;
      // console.log(action.payload.data);
      state.data = action.payload.data;
    },
    addUserSuccess: (state, action) => {
      state.loading = false;
      console.log('state', action.payload);
      state.data.unshift(action.payload.data);
    },
    updateUserSuccess: (state, action) => {
      const updatedUser = action.payload.data;
      // console.log(action.payload);
      const {
        username,
        lastName,
        firstName,
        birthdate,
        mobile,
        phone,
        email,
        address,
        enabled,
        lastEditedBy,
        lastEditerName,
        updatedAt,
      } = updatedUser;
      const index = state.data.findIndex(item => item.username === username);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          username,
          lastName,
          firstName,
          birthdate,
          mobile,
          phone,
          email,
          address,
          enabled,
          lastEditedBy,
          lastEditerName,
          updatedAt,
        };
      }
      state.loading = false;
    },
    clearUserError: (state, action) => {
      state.error = null;
    },
  },
});
export default userSlice.reducer;

export const {
  requestStarted,
  requestFailed,
  requestUsersSuccess,
  addUserSuccess,
  updateUserSuccess,
  clearUserError,
} = userSlice.actions;

const apiPath = '/user';
export const getUsers = TOKEN => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/all?includeNotEnabled=true`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: requestUsersSuccess.type,
    onError: requestFailed.type,
  });
};
export const addUser = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `/auth/register/user`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: addUserSuccess.type,
    onError: requestFailed.type,
  });
};
export const updateUser = (TOKEN, username, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/${username}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: updateUserSuccess.type,
    onError: requestFailed.type,
  });
};

export const userRequests = {
  getAll: getUsers,
  add: addUser,
  update: updateUser,
};
