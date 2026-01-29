import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Hero Section
export const useGetHero = (language = 'fa') =>
  useQuery({
    queryKey: ['landing-hero', language],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.landing.heroPublic, {
        params: { language },
      });
      return response;
    },
  });

export const useUpdateHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.put(endpoints.landing.hero, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-hero'] });
    },
  });
};

// Manifesto
export const useGetManifesto = (language = 'fa') =>
  useQuery({
    queryKey: ['landing-manifesto', language],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.landing.manifestoPublic, {
        params: { language },
      });
      return response;
    },
  });

export const useUpdateManifesto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.put(endpoints.landing.manifesto, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-manifesto'] });
    },
  });
};

// Journey Cards
export const useGetJourneys = (language = 'fa') =>
  useQuery({
    queryKey: ['landing-journeys', language],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.landing.journeysList, {
        params: { language },
      });
      return response;
    },
  });

export const useCreateJourney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.landing.journeys, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-journeys'] });
    },
  });
};

export const useUpdateJourney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(endpoints.landing.journeyById(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-journeys'] });
    },
  });
};

export const useDeleteJourney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(endpoints.landing.journeyById(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-journeys'] });
    },
  });
};

export const useReorderJourneys = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.put(endpoints.landing.journeysReorder, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-journeys'] });
    },
  });
};

// Multi-Dimensional
export const useGetMultiDimensional = (language = 'fa') =>
  useQuery({
    queryKey: ['landing-multi-dimensional', language],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.landing.multiDimensionalPublic, {
        params: { language },
      });
      return response;
    },
  });

export const useUpdateMultiDimensional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.put(endpoints.landing.multiDimensional, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-multi-dimensional'] });
    },
  });
};

// Footer
export const useGetFooter = (language = 'fa') =>
  useQuery({
    queryKey: ['landing-footer', language],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.landing.footerPublic, {
        params: { language },
      });
      return response;
    },
  });

export const useUpdateFooter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstance.put(endpoints.landing.footer, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-footer'] });
    },
  });
};
