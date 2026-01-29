import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all payments (admin)
export const useGetPayments = (params = {}) =>
  useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.admin.payments, { params });
      return response.data;
    },
  });
