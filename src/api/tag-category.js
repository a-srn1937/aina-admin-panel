import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all tag categories
export const useGetTagCategories = () =>
  useQuery({
    queryKey: ['tag-categories'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tagCategory.root);
      return response;
    },
  });

// Get tag category by ID
export const useGetTagCategoryById = (id) =>
  useQuery({
    queryKey: ['tag-category', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tagCategory.byId(id));
      return response;
    },
    enabled: !!id,
  });

// Create tag category
export const useCreateTagCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.tagCategory.root, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-categories'] });
    },
  });
};

// Update tag category
export const useUpdateTagCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.tagCategory.byId(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tag-categories'] });
      queryClient.invalidateQueries({ queryKey: ['tag-category', variables.id] });
    },
  });
};

// Delete tag category
export const useDeleteTagCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.tagCategory.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-categories'] });
    },
  });
};
