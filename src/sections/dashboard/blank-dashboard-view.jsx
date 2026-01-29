'use client';

import { useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/auth/hooks';

export default function BlankDashboardView() {
  const params = useParams();
  const router = useRouter();
  const {
    user: { organizations },
  } = useAuthContext();

  useEffect(() => {
    router.replace(paths.dashboard.user.root);
  }, [params, router, organizations]);

  return <SplashScreen />;
}
