'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { SplashScreen } from 'src/components/loading-screen';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(JWT_STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const userRes = await axios.get(endpoints.user.me);
        const user = userRes.data;

        // Check if user is admin or owner
        if (!['admin', 'owner'].includes(user.role)) {
          console.error('Access denied: User is not admin');
          setState({ user: null, loading: false });
          return null;
        }

        setState({ user: { ...user, accessToken }, loading: false });
        return user;
      } else {
        setState({ user: null, loading: false });
        return null;
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
      return null;
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return (
    <AuthContext value={memoizedValue}>
      {state.loading ? <SplashScreen /> : null}
      {children}
    </AuthContext>
  );
}
