import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get questions by test ID
export const useGetQuestionsByTest = (test_id, params = {}) =>
  useQuery({
    queryKey: ['questions', 'test', test_id, params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.question.root, {
        params: { test_id, ...params },
      });
      return response.data;
    },
    enabled: !!test_id,
  });

// Get question by ID
export const useGetQuestionById = (id) =>
  useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.question.byId(id));
      return response.data;
    },
    enabled: !!id,
  });

// Create question
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.question.root, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', 'test', variables.test_id] });
    },
  });
};

// Bulk create questions
export const useBulkCreateQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.question.bulk, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', 'test', variables.test_id] });
    },
  });
};

// Update question
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.question.byId(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

// Delete question
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.question.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

// Add question variants
export const useAddQuestionVariants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, variants }) =>
      axiosInstance.post(endpoints.question.variants(id), { variants }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

// Update question variant
export const useUpdateQuestionVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data }) => axiosInstance.patch(endpoints.question.variantById(variantId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};
