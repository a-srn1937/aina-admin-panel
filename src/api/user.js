import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get current user
export const useGetCurrentUser = () =>
  useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.user.me);
      return response.data;
    },
  });

// Get all users (admin)
export const useGetUsers = (params = {}) =>
  useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.admin.users, { params });
      return response.data;
    },
  });
