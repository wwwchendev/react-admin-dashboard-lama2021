import { configureStore, combineReducers } from '@reduxjs/toolkit';
//middleware
// import logger from 'redux-logger';
import api from '@/store/middleware/api';
import error from '@/store/middleware/error';
//reducer
import jobStructureReducer from '@/store/jobStructure';
import employeeReducer from '@/store/employee';
import authEmployeeReducer from '@/store/authEmployee';
import userReducer from '@/store/user';
import productCategoryReducer from '@/store/productCategory';
import productReducer from '@/store/product';
import newsReducer from '@/store/news';
import contactHistoryReducer from '@/store/contactHistory';
import fileReducer from '@/store/file';
import orderReducer from '@/store/order';
import logisticReducer from '@/store/logistic';
// import storageReducer from '@/store/storage';
// persist
// https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const appReducer = combineReducers({
  file: fileReducer,
  jobStructure: jobStructureReducer,
  employee: employeeReducer,
  authEmployee: authEmployeeReducer,
  contactHistory: contactHistoryReducer,
  user: userReducer,
  productCategory: productCategoryReducer,
  product: productReducer,
  news: newsReducer,
  order: orderReducer,
  logistic: logisticReducer,
  // storage: storageReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined; // 重置所有狀態(用於登出)
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // logger,
      api,
      error,
    ),
});

export default store;

export let persistor = persistStore(store);
