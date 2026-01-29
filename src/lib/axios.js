import axios from 'axios';
import { toast } from 'sonner';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('jwt_access_token');
      window.location.href = '/auth/sign-in';
      return Promise.reject(error);
    }

    const message = error?.response?.data?.message || error?.message || 'خطایی رخ داده است!';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];
    const res = await axiosInstance.get(url, config);
    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: '/auth/login',
    otpRequest: '/auth/otp/request',
    otpVerify: '/auth/otp/verify',
  },
  user: {
    me: '/users/me',
  },
  admin: {
    users: '/admin/users',
    tests: '/admin/tests',
    payments: '/admin/payments',
    dashboardStats: '/admin/dashboard-stats',
  },
  test: {
    root: '/tests',
    byId: (id) => `/tests/${id}`,
    bySlug: (slug) => `/tests/slug/${slug}`,
    variants: (id) => `/tests/${id}/variants`,
    variantById: (variantId) => `/tests/variants/${variantId}`,
  },
  question: {
    root: '/questions',
    byId: (id) => `/questions/${id}`,
    variants: (id) => `/questions/${id}/variants`,
    variantById: (variantId) => `/questions/variants/${variantId}`,
    bulk: '/questions/bulk',
  },
  option: {
    root: '/options',
    byId: (id) => `/options/${id}`,
    byQuestion: (questionId) => `/options/question/${questionId}`,
    variants: (id) => `/options/${id}/variants`,
    variantById: (variantId) => `/options/variants/${variantId}`,
  },
  language: {
    root: '/languages',
  },
  index: {
    root: '/index',
    byId: (id) => `/index/${id}`,
  },
  formula: {
    root: '/formula',
  },
  payment: {
    root: '/payment',
    myPayments: '/payment/my-payments',
  },
  service: {
    root: '/services',
    byId: (id) => `/services/${id}`,
    byTest: (testId) => `/services/test/${testId}`,
  },
  file: {
    upload: '/files/upload',
    byId: (id) => `/files/${id}`,
  },
  siteContent: {
    root: '/site-content',
    byKey: (key) => `/site-content/${key}`,
  },
  landing: {
    hero: '/landing/admin/hero',
    heroPublic: '/landing/hero',
    manifesto: '/landing/admin/manifesto',
    manifestoPublic: '/landing/manifesto',
    journeys: '/landing/admin/journeys',
    journeyById: (id) => `/landing/admin/journeys/${id}`,
    journeysReorder: '/landing/admin/journeys/reorder',
    journeysList: '/landing/journeys',
    multiDimensional: '/landing/admin/multi-dimensional',
    multiDimensionalPublic: '/landing/multi-dimensional',
    footer: '/landing/admin/footer',
    footerPublic: '/landing/footer',
  },
  tagCategory: {
    root: '/tags/categories',
    byId: (id) => `/tags/categories/${id}`,
  },
  tag: {
    root: '/tags',
    byId: (id) => `/tags/${id}`,
    byTest: (testId) => `/tags/tests/${testId}`,
    byUser: (userId) => `/tags/users/${userId}`,
    removeFromTest: (testId, tagId) => `/tags/tests/${testId}/tags/${tagId}`,
    removeFromUser: (userId, tagId) => `/tags/users/${userId}/tags/${tagId}`,
    testMatchingLogic: (testId) => `/tags/tests/${testId}/matching-logic`,
  },
  demographicQuestion: {
    root: '/demographic-questions',
    byId: (id) => `/demographic-questions/${id}`,
    onboarding: '/demographic-questions/onboarding',
    answer: (id) => `/demographic-questions/${id}/answer`,
  },
  feedback: {
    root: '/feedback',
    byId: (id) => `/feedback/${id}`,
    reply: (id) => `/feedback/${id}/reply`,
    resolve: (id) => `/feedback/${id}/resolve`,
    pendingCount: '/feedback/pending-count',
  },
};
