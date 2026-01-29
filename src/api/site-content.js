import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all site contents (admin)
export const useGetSiteContents = () =>
  useQuery({
    queryKey: ['site-contents'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.siteContent.root);
      return response;
    },
  });

// Get site content by key (public)
export const useGetSiteContentByKey = (key) =>
  useQuery({
    queryKey: ['site-content', key],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.siteContent.byKey(key));
      return response;
    },
    enabled: !!key,
  });

// Update/Create site content by key (admin)
export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }) => axiosInstance.put(endpoints.siteContent.byKey(key), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site-contents'] });
      queryClient.invalidateQueries({ queryKey: ['site-content', variables.key] });
    },
  });
};
