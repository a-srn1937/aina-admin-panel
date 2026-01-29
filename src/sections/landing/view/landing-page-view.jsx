'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import {
  HeroForm,
  FooterForm,
  ManifestoForm,
  JourneyCardsManager,
  MultiDimensionalForm,
} from '../components';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'hero',
    label: 'Hero Section',
    icon: 'solar:home-bold-duotone',
    component: HeroForm,
  },
  {
    value: 'manifesto',
    label: 'Manifesto',
    icon: 'solar:document-text-bold-duotone',
    component: ManifestoForm,
  },
  {
    value: 'journeys',
    label: 'Journey Cards',
    icon: 'solar:map-point-bold-duotone',
    component: JourneyCardsManager,
  },
  {
    value: 'multi-dimensional',
    label: 'Multi-Dimensional',
    icon: 'solar:widget-5-bold-duotone',
    component: MultiDimensionalForm,
  },
  {
    value: 'footer',
    label: 'Footer',
    icon: 'solar:align-bottom-bold-duotone',
    component: FooterForm,
  },
];

// ----------------------------------------------------------------------

export function LandingPageView() {
  const [currentTab, setCurrentTab] = useState('hero');

  const ActiveComponent = TABS.find((tab) => tab.value === currentTab)?.component;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Iconify icon="solar:widget-4-bold-duotone" width={32} sx={{ color: 'white' }} />
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          مدیریت لندینگ پیج
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ویرایش بخش‌های مختلف صفحه اصلی
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontSize: 15,
              fontWeight: 500,
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon={tab.icon} width={20} />
                  <span>{tab.label}</span>
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Card>

      {/* Content */}
      <Card sx={{ p: 3 }}>
        {ActiveComponent && <ActiveComponent />}
      </Card>
    </Box>
  );
}
