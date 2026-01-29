'use client';

import Image from 'next/image';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export function Logo({ sx, disabled, className, href = '/', isSingle = true, ...other }) {
  const singleLogo = (
    <Image
      src="/logo/logo-single.png"
      height={50}
      width={50}
      style={{ width: '100%', maxWidth: '100%', maxHeight: '100%' }}
      alt="GAP"
    />
  );

  const fullLogo = (
    <Image
      src="/logo/logo-full.png"
      height={40}
      width={40}
      style={{ width: '100%', maxWidth: '100%', maxHeight: '100%' }}
      alt="GAP"
    />
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
