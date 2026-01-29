import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all services
export const useGetServices = (params = {}) =>
  useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.service.root, { params });
      return response;
    },
  });

// Get service by ID
export const useGetServiceById = (id) =>
  useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.service.byId(id));
      return response;
    },
    enabled: !!id,
  });

// Get services by test ID
export const useGetServicesByTest = (testId) =>
  useQuery({
    queryKey: ['services', 'test', testId],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.service.byTest(testId));
      return response;
    },
    enabled: !!testId,
  });

// Create service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.service.root, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

// Update service
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.service.byId(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
    },
  });
};

// Delete service
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.service.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
