// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    verify: `${ROOTS.AUTH}/verify`,
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
    user: {
      root: `${ROOTS.DASHBOARD}/users`,
      profile: (userId) => `${ROOTS.DASHBOARD}/users/${userId}`,
    },
    test: {
      root: `${ROOTS.DASHBOARD}/tests`,
      details: (testId) => `${ROOTS.DASHBOARD}/tests/${testId}`,
      questionOptions: (testId, questionId) => `${ROOTS.DASHBOARD}/tests/${testId}/questions/${questionId}/options`,
    },
    payment: {
      root: `${ROOTS.DASHBOARD}/payments`,
    },
    service: {
      root: `${ROOTS.DASHBOARD}/services`,
    },
    index: {
      root: `${ROOTS.DASHBOARD}/indexes`,
    },
    siteContent: {
      root: `${ROOTS.DASHBOARD}/site-content`,
    },
    landing: {
      root: `${ROOTS.DASHBOARD}/landing`,
    },
    tagCategory: {
      root: `${ROOTS.DASHBOARD}/tag-categories`,
    },
    tag: {
      root: `${ROOTS.DASHBOARD}/tags`,
    },
    demographicQuestion: {
      root: `${ROOTS.DASHBOARD}/demographic-questions`,
      create: `${ROOTS.DASHBOARD}/demographic-questions/create`,
      edit: (id) => `${ROOTS.DASHBOARD}/demographic-questions/${id}/edit`,
    },
    feedback: {
      root: `${ROOTS.DASHBOARD}/feedback`,
    },
  },
};
