import { useCallback } from 'react';

import { Tooltip, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { signOut } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, sx, ...other }) {
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      window.location.reload();

      onClose?.();
    } catch (error) {
      console.error(error);
    }
  }, [onClose]);

  return (
    <Tooltip title="خروج">
      <IconButton size="large" color="error" onClick={handleLogout} sx={sx} {...other}>
        <Iconify icon="eva:log-out-fill" />
      </IconButton>
    </Tooltip>
  );
}
