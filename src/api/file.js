import { useMutation } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Upload file
export const useUploadFile = () =>
  useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post(endpoints.file.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    },
  });

// Delete file
export const useDeleteFile = () =>
  useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.file.byId(id)),
  });
