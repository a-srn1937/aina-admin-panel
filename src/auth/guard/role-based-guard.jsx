'use client';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { SplashScreen } from 'src/components/loading-screen';
import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function RoleBasedGuard({ sx, children, hasContent, allowedRoles }) {
  const {
    user: { role = 'user' },
    isLoading,
  } = useAuthContext();

  if (isLoading) return <SplashScreen />;

  if (
    allowedRoles.includes(role)
    // Array.isArray(currentRoles) &&
    // Array.isArray(allowedRoles) &&
    // !intersection(
    //   allowedRoles,
    //   currentRoles.map(({ title }) => title)
    // ).length
  ) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            دسترسی غیرمجاز
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            شما مجوز دسترسی به این صفحه را ندارید.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
