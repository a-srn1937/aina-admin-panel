import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all formulas
export const useGetFormulas = () =>
  useQuery({
    queryKey: ['formula'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.formula.root);
      return response;
    },
  });
