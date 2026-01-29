import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all feedbacks with filters
export const useGetFeedbacks = (params = {}) =>
  useQuery({
    queryKey: ['feedbacks', params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.feedback.root, { params });
      return response;
    },
  });

// Get feedback by ID
export const useGetFeedbackById = (id) =>
  useQuery({
    queryKey: ['feedback', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.feedback.byId(id));
      return response;
    },
    enabled: !!id,
  });

// Get pending count
export const useGetPendingCount = () =>
  useQuery({
    queryKey: ['feedback-pending-count'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.feedback.pendingCount);
      return response;
    },
  });

// Reply to feedback
export const useReplyFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }) => axiosInstance.patch(endpoints.feedback.reply(id), { reply }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['feedback-pending-count'] });
    },
  });
};

// Resolve feedback
export const useResolveFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.patch(endpoints.feedback.resolve(id)),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', id] });
      queryClient.invalidateQueries({ queryKey: ['feedback-pending-count'] });
    },
  });
};
