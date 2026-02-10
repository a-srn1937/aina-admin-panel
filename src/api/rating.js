import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

export const useGetRatingStats = () =>
  useQuery({
    queryKey: ['admin', 'rating-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.rating.stats);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

export const useGetRatings = ({ page = 1, limit = 20, min_score, max_score, has_comment }) =>
  useQuery({
    queryKey: ['admin', 'ratings', { page, limit, min_score, max_score, has_comment }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (min_score) params.append('min_score', min_score);
      if (max_score) params.append('max_score', max_score);
      if (has_comment !== undefined) params.append('has_comment', has_comment);

      const response = await axiosInstance.get(`${endpoints.rating.root}?${params.toString()}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 2, 
  });
