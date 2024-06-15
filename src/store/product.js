/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    requestStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
    },
    requestFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //新增
    addProductSuccess: (state, action) => {
      state.loading = false;
      state.data.push(action.payload.data);
    },
    //更新
    updateProductSuccess: (state, action) => {
      console.log(action.payload.data);
      state.loading = false;
      const index = state.data.findIndex(
        item => item.productId === action.payload.id,
      );
      state.data[index] = action.payload.product;
    },
    //刪除
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      // console.log(action.payload.data);
      state.data = state.data.filter(
        item => item.productId !== action.payload.data._id,
      );
    },
    clearProductError: (state, action) => {
      state.error = null;
    },
  },
});

export default productSlice.reducer;
export const {
  requestStarted,
  requestSuccess,
  requestFailed,
  deleteProductSuccess,
  updateProductSuccess,
  addProductSuccess,
  clearProductError,
} = productSlice.actions;

const apiPath = '/product';

export const getProducts = TOKEN => {
  return apiCallBegan({
    url: `${apiPath}/all/with-auth`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: requestSuccess.type,
    onError: requestFailed.type,
  });
};
export const getProductById = productId => {
  return apiCallBegan({
    url: `${apiPath}/find/${productId}`,
    method: 'get',
    data: null,
    onStart: requestStarted.type,
    onSuccess: requestSuccess.type,
    onError: requestFailed.type,
  });
};
export const addProduct = (TOKEN, data) => {
  return apiCallBegan({
    url: apiPath,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: addProductSuccess.type,
    onError: requestFailed.type,
  });
};
export const updateProduct = (TOKEN, id, data) => {
  return apiCallBegan({
    url: `${apiPath}/${id}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: updateProductSuccess.type,
    onError: requestFailed.type,
  });
};
export const deleteProduct = (TOKEN, id) => {
  return apiCallBegan({
    url: `${apiPath}/${id}`,
    method: 'delete',
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestStarted.type,
    onSuccess: deleteProductSuccess.type,
    onError: requestFailed.type,
  });
};

export const productRequests = {
  create: addProduct,
  getAll: getProducts,
  getById: getProductById,
  update: updateProduct,
  delete: deleteProduct,
};
