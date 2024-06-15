import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase/config';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const storageSlice = createSlice({
  name: 'storage',
  initialState: initialState,
  reducers: {
    requestStarted: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    requestFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default storageSlice.reducer;
const { requestStarted, requestSuccess, requestFailed } = storageSlice.actions;

const uploadFile = createAsyncThunk(
  'storage/upload',
  async ({ file, path }, { dispatch, rejectWithValue }) => {
    dispatch(requestStarted());
    try {
      const storageRef = ref(storage, path + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;
      // 獲取URL並傳給store
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      dispatch(requestSuccess(url));
      return url;
    } catch (error) {
      dispatch(requestFailed(error.message));
      return rejectWithValue(error.message);
    }
  },
);
export const storageRequests = {
  upload: uploadFile,
};
