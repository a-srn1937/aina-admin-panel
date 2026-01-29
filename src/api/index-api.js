import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all indexes
export const useGetIndexes = () =>
  useQuery({
    queryKey: ['indexes'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.index.root);
      return response.data;
    },
  });

// Create index
export const useCreateIndex = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.index.root, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indexes'] });
    },
  });
};

// Update index
export const useUpdateIndex = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.index.byId(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indexes'] });
    },
  });
};

// Delete index
export const useDeleteIndex = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.index.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indexes'] });
    },
  });
};
