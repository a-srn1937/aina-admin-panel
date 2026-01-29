'use client';

import React from 'react';

import { Box, Link } from '@mui/material';

import { RouterLink } from 'src/routes/components';

function LeftSection() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
      {/** @slot Settings button */}
      {/* <SettingsButton /> */}

      {/** @slot Help link */}
      <Link
        // href={paths.faqs}
        href="tel:09125055724"
        component={RouterLink}
        color="inherit"
        sx={{ typography: 'subtitle2' }}
      >
        به کمک نیاز دارید؟
      </Link>
    </Box>
  );
}

export default LeftSection;
