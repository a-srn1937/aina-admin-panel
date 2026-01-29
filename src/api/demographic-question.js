import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all demographic questions
export const useGetDemographicQuestions = () =>
  useQuery({
    queryKey: ['demographic-questions'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.demographicQuestion.root);
      return response;
    },
  });

// Get onboarding questions
export const useGetOnboardingQuestions = () =>
  useQuery({
    queryKey: ['demographic-questions', 'onboarding'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.demographicQuestion.onboarding);
      return response;
    },
  });

// Get demographic question by ID
export const useGetDemographicQuestionById = (id) =>
  useQuery({
    queryKey: ['demographic-question', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.demographicQuestion.byId(id));
      return response;
    },
    enabled: !!id,
  });

// Create demographic question
export const useCreateDemographicQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.demographicQuestion.root, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demographic-questions'] });
    },
  });
};

// Update demographic question
export const useUpdateDemographicQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.put(endpoints.demographicQuestion.byId(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['demographic-questions'] });
      queryClient.invalidateQueries({ queryKey: ['demographic-question', variables.id] });
    },
  });
};

// Delete demographic question
export const useDeleteDemographicQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.demographicQuestion.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demographic-questions'] });
    },
  });
};

// Answer demographic question
export const useAnswerDemographicQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.post(endpoints.demographicQuestion.answer(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tags'] });
    },
  });
};
