import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Card, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { normalizePhone } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function NavUserCard({ sx, ...other }) {
  const { user = {} } = useAuthContext();
  const { first_name, last_name, phone, avatar } = user;
  const full_name = `${first_name} ${last_name}`;

  return (
    <Box
      p={2}
      sx={{ textDecoration: 'none' }}
      // component={RouterLink}
      // href={paths.dashboard.profile.root}
    >
      <Card
        component={Stack}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={[
          (theme) => ({
            p: 1,
            textAlign: 'center',
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src={undefined} alt={full_name} sx={{ width: 32, height: 32 }}>
            {full_name?.charAt(0).toUpperCase()}
          </Avatar>

          <Stack alignItems="flex-start">
            <Typography fontSize={11} fontWeight={700} noWrap color="text.secondary">
              {full_name}
            </Typography>

            <Typography
              variant="caption"
              fontWeight={700}
              noWrap
              sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
            >
              {normalizePhone(phone)}
            </Typography>
          </Stack>
        </Stack>
        <Iconify icon="eva:arrow-ios-back-fill" sx={{ color: 'text.secondary' }} />
      </Card>
    </Box>
  );
}
