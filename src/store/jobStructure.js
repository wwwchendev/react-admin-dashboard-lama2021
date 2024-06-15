/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const jobStructureSlice = createSlice({
  name: 'jobStructure',
  initialState: initialState,
  reducers: {
    requestJobStructureStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestJobStructureSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
    },
    requestJobStructureFailed: (state, action) => {
      // console.log(action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    clearJobStructureError: (state, action) => {
      state.error = null;
    },
    //department
    addJobDepartmentSuccess: (state, action) => {
      state.data.unshift({
        ...action.payload.data,
        sections: [],
      });
      state.loading = false;
    },
    updateJobDepartmentSuccess: (state, action) => {
      const updatedData = action.payload.data;
      const index = state.data.findIndex(item => item._id === updatedData._id);
      // console.log(index);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedData,
        };
      }
      state.loading = false;
    },
    deleteJobDepartmentSuccess: (state, action) => {
      const deletedData = action.payload.data;
      const deletedId = deletedData._id;
      const newData = state.data.filter(item => item._id !== deletedId);
      state.data = newData;
      state.loading = false;
    },
    //section
    addJobSectionSuccess: (state, action) => {
      const data = action.payload.data;
      const index = state.data.findIndex(item => {
        return item._id === data.departmentId;
      });
      state.data[index].sections.unshift(data);
      state.loading = false;
    },
    updateJobSectionSuccess: (state, action) => {
      const updatedData = action.payload.data;
      console.log(updatedData);
      const departmentIndex = state.data.findIndex(item => {
        return item._id === updatedData.departmentId;
      });
      const department = state.data[departmentIndex];
      const sectionIndex = department.sections.findIndex(item => {
        return item._id === updatedData._id;
      });
      if (sectionIndex !== -1) {
        state.data[departmentIndex].sections[sectionIndex] = {
          ...state.data[departmentIndex].sections[sectionIndex],
          ...updatedData,
        };
      }
      state.loading = false;
    },
    deleteJobSectionSuccess: (state, action) => {
      const deletedSectionId = action.payload.data._id;
      const departmentId = action.payload.data.departmentId;
      const index = state.data.findIndex(item => {
        return item._id === departmentId;
      });
      if (index !== -1) {
        const updatedSections = state.data[index].sections.filter(
          item => item._id !== deletedSectionId,
        );

        const updatedDepartment = {
          ...state.data[index],
          sections: updatedSections,
        };
        const newData = [...state.data];
        newData[index] = updatedDepartment;

        state.data = newData;
        state.loading = false;
      }
    },
  },
});
export default jobStructureSlice.reducer;

export const {
  requestJobStructureStarted,
  requestJobStructureSuccess,
  requestJobStructureFailed,
  addJobDepartmentSuccess,
  updateJobDepartmentSuccess,
  deleteJobDepartmentSuccess,
  addJobSectionSuccess,
  updateJobSectionSuccess,
  deleteJobSectionSuccess,
  clearJobStructureError,
} = jobStructureSlice.actions;

const apiPath = '/auth/jobStructure';

export const getJobStructure = TOKEN => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'get',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: requestJobStructureSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};
//department
export const addJobDepartment = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/department`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: addJobDepartmentSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};
export const updateJobDepartment = (TOKEN, id, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/department/${id}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: updateJobDepartmentSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};
export const deleteJobDepartment = (TOKEN, id) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/department/${id}`,
    method: 'delete',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: deleteJobDepartmentSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};
//section
export const addJobSection = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/section`,
    method: 'post',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: addJobSectionSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};
export const updateJobSection = (TOKEN, id, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/section/${id}`,
    method: 'put',
    data: data,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: updateJobSectionSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};
export const deleteJobSection = (TOKEN, id) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/section/${id}`,
    method: 'delete',
    data: null,
    headers: { authorization: `Bearer ${TOKEN}` },
    onStart: requestJobStructureStarted.type,
    onSuccess: deleteJobSectionSuccess.type,
    onError: requestJobStructureFailed.type,
  });
};

export const jobStructureRequests = {
  getAll: getJobStructure,
  create: {
    department: addJobDepartment,
    section: addJobSection,
  },
  update: {
    department: updateJobDepartment,
    section: updateJobSection,
  },
  delete: {
    department: deleteJobDepartment,
    section: deleteJobSection,
  },
};
