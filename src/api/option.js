import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get options by question ID
export const useGetOptionsByQuestion = (questionId) =>
  useQuery({
    queryKey: ['options', 'question', questionId],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.option.byQuestion(questionId));
      return response.data;
    },
    enabled: !!questionId,
  });

// Create option
export const useCreateOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.option.root, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['options', 'question', variables.question_id] });
    },
  });
};

// Update option
export const useUpdateOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.option.byId(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};

// Delete option
export const useDeleteOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.option.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};

// Add option variants
export const useAddOptionVariants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, variants }) =>
      axiosInstance.post(endpoints.option.variants(id), { variants }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};

// Update option variant
export const useUpdateOptionVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data }) => axiosInstance.patch(endpoints.option.variantById(variantId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};
