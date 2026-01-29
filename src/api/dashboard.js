import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get dashboard stats (admin)
export const useGetDashboardStats = () =>
  useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.admin.dashboardStats);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
