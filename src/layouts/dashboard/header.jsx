'use client';

import { merge } from 'es-toolkit';

import { Box, Stack, Typography, Breadcrumbs, iconButtonClasses } from '@mui/material';

import { _notifications } from 'src/_mock';

import { HeaderSection } from '../core';
import { useNavItems } from '../nav-config-dashboard';
import { SignOutButton } from '../components/sign-out-button';
import { NotificationsDrawer } from '../components/notifications-drawer';
// import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function DashboardHeader({
  sx,
  title,
  description,
  breadcrumbs,
  actions,
  slotProps,
  layoutQuery = 'lg',
  hideNotifications = false,
}) {
  const navItems = useNavItems();

  // const settings = useSettingsContext();

  // const isNavMini = settings.state.navLayout === 'mini';
  // const isNavHorizontal = settings.state.navLayout === 'horizontal';
  // const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        // maxWidth: false,
        sx: (theme) => ({
          // ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          // ...(isNavHorizontal && {
          pt: 2,
          bgcolor: 'var(--layout-nav-bg)',
          height: { [layoutQuery]: 'var(--layout-dashboard-header-height)' },
          [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
          // [theme.breakpoints.up(layoutQuery)]: {
          //   px: 'var(--layout-dashboard-content-px)',
          //   ...(isNavHorizontal && { '--layout-dashboard-content-pt': '40px' }),
          // },
          // }),
        }),
      },
    };

    const headerSlots = {
      topArea: null,
      bottomArea: null,
      leftArea: (
        <Stack>
          <Typography variant="h4"> {title} </Typography>
          {description && <Typography sx={{ mt: 1 }}> {description} </Typography>}
          <Breadcrumbs aria-label="breadcrumb" separator="•" sx={{ mt: 1 }}>
            {breadcrumbs?.map(({ label, href, disabled = false }) => (
              <Typography
                key={label}
                color={disabled ? 'text.disabled' : 'text.primary'}
                variant="body2"
                // component={disabled ? 'span' : RouterLink}
                // href={href}
                sx={{ cursor: disabled ? 'default' : 'pointer', textDecoration: 'none' }}
              >
                {label}
              </Typography>
            ))}
          </Breadcrumbs>
        </Stack>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {actions}

          {!hideNotifications && (
            <>
              {/** @slot Notifications popover */}
              <NotificationsDrawer data={_notifications} />

              {/** @slot Searchbar */}
              {/* <Searchbar data={navItems} /> */}

              {/** @slot SignOutButton */}
              <SignOutButton size="small" />
            </>
          )}
        </Box>
      ),
    };

    return (
      <HeaderSection
        // layoutQuery={layoutQuery}
        // disableElevation={isNavVertical}
        // {...slotProps?.header}
        slots={{ ...headerSlots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  return renderHeader();
}
