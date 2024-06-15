/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const productCategorySlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    requestProductCategoryStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestProductCategorySuccess: (state, action) => {
      // console.log(action.payload.data);
      state.loading = false;
      state.data = action.payload.data;
    },
    requestProductCategoryFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductCategoryError: (state, action) => {
      state.error = null;
    },
    //mainCategory
    addProductCategorySuccess: (state, action) => {
      state.data.unshift({
        ...action.payload.data,
        subCategory: [],
      });
      state.loading = false;
    },
    updateProductCategorySuccess: (state, action) => {
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
    deleteProductCategorySuccess: (state, action) => {
      const deletedData = action.payload.data;
      const deletedId = deletedData._id;
      const newData = state.data.filter(item => item._id !== deletedId);
      state.data = newData;
      state.loading = false;
    },
    //subCategory
    addProductSubCategorySuccess: (state, action) => {
      const data = action.payload.data;
      // console.log(data);
      const index = state.data.findIndex(item => {
        return item._id === data.parentCategoryId;
      });
      state.data[index].subCategory.push({ ...data, counts: 0 });
      state.loading = false;
    },
    updateProductSubCategorySuccess: (state, action) => {
      //新資料
      const updatedSubCategoryData = action.payload.data;
      const updatedCategoryId = updatedSubCategoryData.parentCategoryId;
      const updatedSubCategoryId = updatedSubCategoryData._id;

      //舊資料
      const flatedData = state.data.flatMap(item => {
        const {
          _id,
          type,
          categoryName,
          display,
          sortOrder,
          __v,
          subCategory: subCategories,
        } = item;
        return subCategories.map(subCategory => ({
          categoryId: _id,
          type,
          categoryName,
          categorySortOrder: sortOrder,
          categoryDisplay: display,
          subCategoryId: subCategory._id,
          subCategoryName: subCategory.subCategoryName,
          subCategorySortOrder: subCategory.sortOrder,
          subCategoryCount: subCategory.counts,
          subCategoryDisplay: subCategory.display,
        }));
      });
      const originSubCategoryData = flatedData.find(
        item => item.subCategoryId === updatedSubCategoryData._id,
      );

      if (updatedCategoryId !== originSubCategoryData.categoryId) {
        //原本的分類中移除子分類
        const categoryIndex = state.data.findIndex(item => {
          return item._id === originSubCategoryData.categoryId;
        });
        const subCategoryIndex = state.data[
          categoryIndex
        ].subCategory.findIndex(item => {
          return item._id === originSubCategoryData.subCategoryId;
        });
        const array = state.data[categoryIndex].subCategory.filter(item => {
          return item._id !== updatedSubCategoryId;
        });
        state.data[categoryIndex].subCategory = array;
        //新分類中加入子分類
        const newCategoryIndex = state.data.findIndex(item => {
          return item._id === updatedCategoryId;
        });
        state.data[newCategoryIndex].subCategory.push({
          ...state.data[categoryIndex].subCategory[subCategoryIndex],
          ...updatedSubCategoryData,
          counts: originSubCategoryData.subCategoryCount,
        });
      } else {
        const categoryIndex = state.data.findIndex(item => {
          return item._id === updatedCategoryId;
        });
        const subCategoryIndex = state.data[
          categoryIndex
        ].subCategory.findIndex(item => {
          return item._id === updatedSubCategoryId;
        });
        state.data[categoryIndex].subCategory[subCategoryIndex] = {
          ...state.data[categoryIndex].subCategory[subCategoryIndex],
          parentCategoryId: updatedSubCategoryData.parentCategoryId,
          subCategoryName: updatedSubCategoryData.subCategoryName,
          display: updatedSubCategoryData.display,
          sortOrder: updatedSubCategoryData.sortOrder,
        };
      }
      state.loading = false;
    },
    deleteProductSubCategorySuccess: (state, action) => {
      const deletedSubCategoryId = action.payload.data._id;
      const deletedMainCategoryId = action.payload.data.parentCategoryId;
      const index = state.data.findIndex(item => {
        return item._id === deletedMainCategoryId;
      });
      if (index !== -1) {
        const updatedSubCategories = state.data[index].subCategory.filter(
          item => item._id !== deletedSubCategoryId,
        );

        const updatedMainCategory = {
          ...state.data[index],
          subCategory: updatedSubCategories,
        };
        const newData = [...state.data];
        newData[index] = updatedMainCategory;

        state.data = newData;
        state.loading = false;
      }
    },
  },
});

export default productCategorySlice.reducer;
export const {
  //productCategory
  requestProductCategoryStarted,
  requestProductCategorySuccess,
  requestProductCategoryFailed,
  clearProductCategoryError,
  //mainCategory
  addProductCategorySuccess,
  updateProductCategorySuccess,
  deleteProductCategorySuccess,
  //subCategory
  addProductSubCategorySuccess,
  updateProductSubCategorySuccess,
  deleteProductSubCategorySuccess,
} = productCategorySlice.actions;

const apiPath = '/ProductCategoryStructure';

//productCategory
export const getProductCategories = TOKEN => {
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: requestProductCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};
//mainCategory
export const addMainProductCategory = (TOKEN, data) => {
  return apiCallBegan({
    url: `${apiPath}/category`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: addProductCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};
export const updateMainProductCategory = (TOKEN, id, data) => {
  return apiCallBegan({
    url: `${apiPath}/category/${id}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: updateProductCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};
export const deleteMainProductCategory = (TOKEN, id) => {
  return apiCallBegan({
    url: `${apiPath}/category/${id}`,
    method: 'delete',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: deleteProductCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};
//subCategory
export const addSubProductCategory = (TOKEN, data) => {
  return apiCallBegan({
    url: `${apiPath}/subCategory`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: addProductSubCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};
export const updateSubProductCategory = (TOKEN, id, data) => {
  return apiCallBegan({
    url: `${apiPath}/subCategory/${id}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: updateProductSubCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};
export const deleteSubProductCategory = (TOKEN, id) => {
  return apiCallBegan({
    url: `${apiPath}/subCategory/${id}`,
    method: 'delete',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestProductCategoryStarted.type,
    onSuccess: deleteProductSubCategorySuccess.type,
    onError: requestProductCategoryFailed.type,
  });
};

export const productCategoryRequests = {
  getAll: getProductCategories,
  create: {
    mainCategory: addMainProductCategory,
    subCategory: addSubProductCategory,
  },
  update: {
    mainCategory: updateMainProductCategory,
    subCategory: updateSubProductCategory,
  },
  delete: {
    mainCategory: deleteMainProductCategory,
    subCategory: deleteSubProductCategory,
  },
};
