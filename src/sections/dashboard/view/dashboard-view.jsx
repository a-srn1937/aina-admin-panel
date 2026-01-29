'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const CARDS = [
  {
    title: 'کاربران',
    description: 'مدیریت کاربران سیستم',
    icon: 'mdi:account-group',
    path: paths.dashboard.user.root,
    color: 'primary',
  },
  {
    title: 'آزمون‌ها',
    description: 'مدیریت آزمون‌ها و سوالات',
    icon: 'mdi:clipboard-text',
    path: paths.dashboard.test.root,
    color: 'info',
  },
  {
    title: 'پرداخت‌ها',
    description: 'مشاهده تراکنش‌های مالی',
    icon: 'mdi:credit-card',
    path: paths.dashboard.payment.root,
    color: 'success',
  },
];

// ----------------------------------------------------------------------

export function DashboardView() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        داشبورد مدیریت
      </Typography>

      <Grid container spacing={3}>
        {CARDS.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              component={RouterLink}
              href={card.path}
              sx={{
                textDecoration: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Iconify
                  icon={card.icon}
                  width={48}
                  sx={{ mb: 2, color: `${card.color}.main` }}
                />
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
