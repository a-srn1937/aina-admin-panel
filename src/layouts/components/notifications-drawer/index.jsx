'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { useBoolean } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { varTap, varHover, transitionTap } from 'src/components/animate';


// ----------------------------------------------------------------------

const TABS = [
  { value: 'all', label: 'همه', count: 22 },
  { value: 'unread', label: 'خوانده نشده', count: 12 },
  { value: 'archived', label: 'بایگانی', count: 10 },
];

// ----------------------------------------------------------------------

export function NotificationsDrawer({ data = [], sx, ...other }) {
  // const { data: { data: notifications = [] } = {} } = useGetNotifications();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const [currentTab, setCurrentTab] = useState('all');

  // const handleChangeTab = useCallback(
  //   (event, newValue) => {
  //     if (newValue === 'unread') {
  //       setNotifications(data.filter((item) => item.isUnRead === true));
  //     } else {
  //       setNotifications(data);
  //     }

  //     setCurrentTab(newValue);
  //   },
  //   [data]
  // );

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  // const handleMarkAllAsRead = () => {
  //   setNotifications(notifications.map((notification) => ({ ...notification, isUnRead: false })));
  // };

  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        minHeight: 68,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        اعلان‌ها
      </Typography>

      {/* {!!totalUnRead && (
        <Tooltip title="علامت‌گذاری همه به عنوان خوانده‌شده">
          <IconButton
            color="primary"
            // onClick={handleMarkAllAsRead}
          >
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )} */}

      <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:settings-bold-duotone" />
      </IconButton>
    </Box>
  );

  const renderTabs = () => (
    <Tabs
      variant="fullWidth"
      value={currentTab}
      // onChange={handleChangeTab}
      indicatorColor="custom"
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'archived' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
        />
      ))}
    </Tabs>
  );

  const renderList = () => (
    <Scrollbar>
      <Box component="ul">
        {/* {notifications?.map((notification) => (
          <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
            <NotificationItem notification={notification} />
          </Box>
        ))} */}
      </Box>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Notifications button"
        onClick={onOpen}
        sx={sx}
        {...other}
      >
        {/* <Badge badgeContent={notifications.length} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge> */}
      </IconButton>

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 1, maxWidth: 420 } },
        }}
      >
        {/* {renderHead()}
        {renderTabs()} */}
        {renderList()}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            مشاهده همه
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
