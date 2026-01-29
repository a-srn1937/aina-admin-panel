import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all tests (admin)
export const useGetTests = (params = {}) =>
  useQuery({
    queryKey: ['admin', 'tests', params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.admin.tests, { params });
      return response.data;
    },
  });

// Get test by ID
export const useGetTestById = (id) =>
  useQuery({
    queryKey: ['test', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.test.byId(id));
      return response.data;
    },
    enabled: !!id,
  });

// Create test
export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.test.root, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] });
    },
  });
};

// Update test
export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.test.byId(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] });
      queryClient.invalidateQueries({ queryKey: ['test', variables.id] });
    },
  });
};

// Delete test
export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.test.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] });
    },
  });
};

// Add test variants
export const useAddTestVariants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, variants }) => axiosInstance.post(endpoints.test.variants(id), { variants }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test', variables.id] });
    },
  });
};

// Update test variant
export const useUpdateTestVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data }) => axiosInstance.patch(endpoints.test.variantById(variantId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] });
    },
  });
};
