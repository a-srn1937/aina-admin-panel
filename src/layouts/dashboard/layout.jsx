'use client';


import { useTheme } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';

import { NavVertical } from './nav-vertical';
import { MainSection, layoutClasses, LayoutSection } from '../core';
import { useNavItems, useNavItemsMini } from '../nav-config-dashboard';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';

// ----------------------------------------------------------------------

export function DashboardLayout({
  sx,
  mini,
  headerSection,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
  meetingId,
}) {
  const theme = useTheme();

  // const { data: { data: currentRoles = [] } = {}, isLoading } = useGetMyRoles();

  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const navConfigs = useNavItems();
  const navConfigsMini = useNavItemsMini();
  const navData = slotProps?.nav?.data ?? (mini ? navConfigsMini : navConfigs);

  const isNavMini = mini || settings.state.navLayout === 'mini';
  const isNavHorizontal = settings.state.navLayout === 'horizontal';

  // const canDisplayItemByRole = (allowedRoles) =>
  //   !isLoading &&
  //   !!intersection(
  //     allowedRoles,
  //     currentRoles.map(({ title }) => title)
  //   ).length;

  const renderSidebar = () => (
    <NavVertical
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      // checkPermissions={canDisplayItemByRole}
      hideToggle={!!mini}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
    />
  );

  const renderFooter = () => <></>;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={headerSection}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={isNavHorizontal ? null : renderSidebar()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
              // pr: isChatOpen ? 'var(--layout-nav-vertical-width)' : 0,
              transition: theme.transitions.create(['padding-left', 'padding-right'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
