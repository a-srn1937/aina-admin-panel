import { useMutation } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.auth.login, data),
  });
}

export function useRequestOTP() {
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.auth.otpRequest, data),
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data) => axiosInstance.post(endpoints.auth.otpVerify, data),
  });
}
