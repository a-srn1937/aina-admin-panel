import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function OrganizationSplitContent({
  sx,
  method,
  methods,
  layoutQuery = 'md',
  title = '',
  imgUrl = `/assets/illustrations/illustration-sign-in.svg`,
  subtitle = '',
  ...other
}) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.76)}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.76)})`,
              `url(/assets/background/background-3-blur.webp)`,
            ],
          }),
          width: '100%',
          px: 3,
          pb: 3,
          display: 'none',
          position: 'relative',
          pt: 'var(--layout-header-desktop-height)',
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 8,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* <div>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
            {subtitle}
          </Typography>
        )}
      </div>

      <Box
        component="img"
        alt="Dashboard illustration"
        src={imgUrl}
        sx={{ width: 1, aspectRatio: '4/3', objectFit: 'fill', maxWidth: 480 }}
      /> */}
    </Box>
  );
}
