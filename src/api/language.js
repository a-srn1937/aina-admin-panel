import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all languages
export const useGetLanguages = () =>
  useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.language.root);
      return response.data;
    },
  });
