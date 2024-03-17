import { configureStore, combineReducers } from '@reduxjs/toolkit';
//middleware
// import logger from 'redux-logger';
import api from '@/store/middleware/api';
import error from '@/store/middleware/error';
//reducer
import employeeReducer from '@/store/employee';
import loginRecordReducer from '@/store/loginRecord';
import userReducer from '@/store/user';
import productReducer from '@/store/products';
import storageReducer from '@/store/storage';
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

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  loginRecord: loginRecordReducer,
  user: userReducer,
  product: productReducer,
  storage: storageReducer,
});
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
