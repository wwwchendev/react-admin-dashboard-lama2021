//utility
import customAxios from '@/utils/axios/customAxios';

export const uploadImage = async (TOKEN, file, filePath, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('filePath', filePath);
  try {
    const response = await customAxios.post(
      `${import.meta.env.VITE_APIURL}/file/upload`,
      formData,
      {
        headers: {
          'authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      },
    );
    return response;
  } catch (error) {
    const err = new Error(error);
    throw err;
  }
};
