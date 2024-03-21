/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '@/store/api';

const initialState = {
  employees: {
    data: [],
    loading: false,
    error: null,
  },
  positions: {
    data: [],
    loading: false,
    error: null,
  },
  loginRecords: {
    data: [],
    loading: false,
    error: null,
  },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState: initialState,
  reducers: {
    requestEmployeesStarted: (state, action) => {
      state.employees.loading = true;
      state.employees.error = null;
    },
    requestEmployeesSuccess: (state, action) => {
      state.employees.loading = false;
      state.employees.data = action.payload;
    },
    requestEmployeesFailed: (state, action) => {
      state.employees.loading = false;
      state.employees.error = action.payload;
    },
    //新增員工資料
    addEmployeeSuccess: (state, action) => {
      state.employees.data.push(action.payload);
      // const newEmployee = action.payload;
      //
      state.employees.loading = false;
    },
    //更新員工資料
    updateEmployeeSuccess: (state, action) => {
      const updatedEmployee = action.payload.data;
      const {
        name,
        role,
        position,
        enabled,
        lastEditedBy,
        createdAt,
        updatedAt,
        __v,
      } = updatedEmployee;
      const index = state.employees.data.findIndex(
        item => item._id === updatedEmployee._id,
      );
      if (index !== -1) {
        state.employees.data[index] = {
          ...state.employees.data[index],
          name,
          role,
          position,
          enabled,
          lastEditedBy,
          createdAt,
          updatedAt,
          __v,
        };
      }
      state.employees.loading = false;
    },
    clearEmployeeError: (state, action) => {
      state.employees.error = null;
    },
    //職位
    requestPositionsStarted: (state, action) => {
      state.positions.loading = true;
      state.positions.error = null;
    },
    requestPositionsSuccess: (state, action) => {
      state.positions.loading = false;
      state.positions.data = action.payload;
    },
    requestPositionsFailed: (state, action) => {
      state.positions.loading = false;
      state.positions.error = action.payload;
    },
    //登入紀錄
    requestLoginRecordsStarted: (state, action) => {
      state.loginRecords.loading = true;
      state.loginRecords.error = null;
    },
    requestLoginRecordsSuccess: (state, action) => {
      state.loginRecords.loading = false;
      state.loginRecords.data = action.payload;
    },
    requestLoginRecordsFailed: (state, action) => {
      state.loginRecords.loading = false;
      state.loginRecords.error = action.payload;
    }
  },
});
export default employeeSlice.reducer;

export const {
  requestEmployeesStarted,
  requestEmployeesSuccess,
  addEmployeeSuccess,
  updateEmployeeSuccess,
  requestEmployeesFailed,
  clearEmployeeError,
  requestLoginRecordsStarted,
  requestLoginRecordsSuccess,
  requestLoginRecordsFailed,
  requestPositionsStarted,
  requestPositionsSuccess,
  requestPositionsFailed,
} = employeeSlice.actions;

const apiPath = '/employee';

export const getEmployees = (TOKEN) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/all?includeNotEnabled=true`,
    method: 'get',
    data: null,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestEmployeesStarted.type,
    onSuccess: requestEmployeesSuccess.type,
    onError: requestEmployeesFailed.type,
  });
};
export const addEmployee = (TOKEN, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}`,
    method: 'post',
    data: data,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestEmployeesStarted.type,
    onSuccess: addEmployeeSuccess.type,
    onError: requestEmployeesFailed.type,
  });
};
export const updateEmployee = (TOKEN, employeeId, data) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/${employeeId}`,
    method: 'put',
    data: data,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestEmployeesStarted.type,
    onSuccess: updateEmployeeSuccess.type,
    onError: requestEmployeesFailed.type,
  });
};
export const getLoginRecords = (TOKEN) => {
  //請從react元件當中獲取token並傳遞參數
  return apiCallBegan({
    url: `${apiPath}/loginRecords`,
    method: 'get',
    data: null,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestLoginRecordsStarted.type,
    onSuccess: requestLoginRecordsSuccess.type,
    onError: requestLoginRecordsFailed.type,
  });
};
export const getPositions = (TOKEN) => {
  return apiCallBegan({
    url: `${apiPath}/positions`,
    method: 'get',
    data: null,
    headers: { token: `Bearer ${TOKEN}` },
    onStart: requestPositionsStarted.type,
    onSuccess: requestPositionsSuccess.type,
    onError: requestPositionsFailed.type,
  });
};

export const EmployeeRequests = {
  getAll: getEmployees,
  add: addEmployee,
  update: updateEmployee,
  getRecords: getLoginRecords,
  getPositions: getPositions,
};
