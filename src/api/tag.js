import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Get all tags
export const useGetTags = (params = {}) =>
  useQuery({
    queryKey: ['tags', params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tag.root, { params });
      return response;
    },
  });

// Get tag by ID
export const useGetTagById = (id) =>
  useQuery({
    queryKey: ['tag', id],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tag.byId(id));
      return response;
    },
    enabled: !!id,
  });

// Create tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.tag.root, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

// Update tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.tag.byId(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tag', variables.id] });
    },
  });
};

// Delete tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.tag.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

// Get test tags
export const useGetTestTags = (testId) =>
  useQuery({
    queryKey: ['test-tags', testId],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tag.byTest(testId));
      return response;
    },
    enabled: !!testId,
  });

// Assign tag to test
export const useAssignTagToTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ testId, data }) => axiosInstance.post(endpoints.tag.byTest(testId), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-tags', variables.testId] });
    },
  });
};

// Update test matching logic
export const useUpdateTestMatchingLogic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ testId, data }) =>
      axiosInstance.put(endpoints.tag.testMatchingLogic(testId), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-tags', variables.testId] });
    },
  });
};

// Remove tag from test
export const useRemoveTagFromTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ testId, tagId }) =>
      axiosInstance.delete(endpoints.tag.removeFromTest(testId, tagId)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-tags', variables.testId] });
    },
  });
};

// Get user tags
export const useGetUserTags = (userId) =>
  useQuery({
    queryKey: ['user-tags', userId],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tag.byUser(userId));
      return response;
    },
    enabled: !!userId,
  });

// Assign tag to user
export const useAssignTagToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => axiosInstance.post(endpoints.tag.byUser(userId), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-tags', variables.userId] });
    },
  });
};

// Remove tag from user
export const useRemoveTagFromUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, tagId }) =>
      axiosInstance.delete(endpoints.tag.removeFromUser(userId, tagId)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-tags', variables.userId] });
    },
  });
};
