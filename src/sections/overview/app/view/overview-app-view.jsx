'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { svgColorClasses } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';
import { useGetDashboardStats } from 'src/api/dashboard';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';

// ----------------------------------------------------------------------

const PERSIAN_MONTHS = {
  '01': 'فروردین',
  '02': 'اردیبهشت',
  '03': 'خرداد',
  '04': 'تیر',
  '05': 'مرداد',
  '06': 'شهریور',
  '07': 'مهر',
  '08': 'آبان',
  '09': 'آذر',
  '10': 'دی',
  '11': 'بهمن',
  '12': 'اسفند',
};

function formatMonthLabel(monthStr) {
  if (!monthStr) return '';
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const month = parts[1];
  return PERSIAN_MONTHS[month] || monthStr;
}

// Get categories from actual data
function getMonthCategories(data) {
  if (!data || data.length === 0) {
    return [];
  }
  return data.map((item) => formatMonthLabel(item.month));
}

// Get series data from actual data
function getSeriesData(data) {
  if (!data || data.length === 0) {
    return [];
  }
  return data.map((item) => item.count || 0);
}

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { data: stats, isLoading, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent maxWidth="xl">
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">خطا در دریافت آمار داشبورد</Typography>
        </Card>
      </DashboardContent>
    );
  }

  // Prepare monthly chart data from actual API data
  const monthlyCategories = getMonthCategories(stats?.monthly?.users);
  const monthlyUsersData = getSeriesData(stats?.monthly?.users);
  const monthlyParticipationsData = getSeriesData(stats?.monthly?.participations);
  const monthlyPaymentsData = getSeriesData(stats?.monthly?.payments);

  const usersTotal = stats?.users?.total || 0;
  const participationsCompleted = stats?.participations?.completed || 0;
  const paymentsSuccessful = stats?.payments?.successful_count || 0;
  const paymentsAmount = stats?.payments?.successful_amount || 0;

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`خوش آمدید 👋 \n ${user?.first_name || 'ادمین'}`}
            description="در این صفحه می‌توانید آمار کلی سامانه را مشاهده کنید."
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <AppWidget
              title="آزمون‌های فعال"
              total={stats?.tests?.active || 0}
              icon="solar:document-bold"
              chart={{ series: stats?.tests?.total ? Math.round((stats.tests.active / stats.tests.total) * 100) : 0 }}
            />
            <AppWidget
              title="درآمد کل (تومان)"
              total={paymentsAmount}
              icon="solar:wallet-money-bold"
              chart={{
                series: paymentsSuccessful > 0 ? 100 : 0,
                colors: [theme.vars.palette.success.light, theme.vars.palette.success.main],
              }}
              sx={{ bgcolor: 'success.dark', [`& .${svgColorClasses.root}`]: { color: 'success.light' } }}
            />
          </Box>
        </Grid>

        {/* User Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="کل کاربران"
            percent={0}
            total={usersTotal}
            chart={{
              categories: monthlyCategories,
              series: monthlyUsersData,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="آزمون های تکمیل شده"
            percent={0}
            total={participationsCompleted}
            chart={{
              colors: [theme.palette.success.main],
              categories: monthlyCategories,
              series: monthlyParticipationsData,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="پرداخت‌های موفق"
            percent={0}
            total={paymentsSuccessful}
            chart={{
              colors: [theme.palette.info.main],
              categories: monthlyCategories,
              series: monthlyPaymentsData,
            }}
          />
        </Grid>

        {/* User Relation Status - Pie Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="وضعیت رابطه کاربران"
            subheader={`از ${fNumber(usersTotal)} کاربر`}
            chart={{
              series: [
                { label: 'در رابطه', value: stats?.users?.in_relation || 0 },
                { label: 'مجرد', value: stats?.users?.not_in_relation || 0 },
              ],
            }}
          />
        </Grid>

        {/* Participation Status - Pie Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="وضعیت آزمون ها"
            subheader={`از ${fNumber(stats?.participations?.total || 0)} شرکت`}
            chart={{
              colors: [
                theme.palette.warning.main,
                theme.palette.info.main,
                theme.palette.success.main,
              ],
              series: [
                { label: 'در انتظار', value: stats?.participations?.pending || 0 },
                { label: 'در حال انجام', value: stats?.participations?.in_progress || 0 },
                { label: 'تکمیل شده', value: stats?.participations?.completed || 0 },
              ],
            }}
          />
        </Grid>

        {/* Report Card Types - Pie Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="انواع کارنامه"
            subheader={`از ${fNumber(stats?.report_cards?.total || 0)} کارنامه`}
            chart={{
              colors: [
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.info.main,
              ],
              series: [
                { label: 'کارنامه اولیه', value: stats?.report_cards?.basic || 0 },
                { label: 'کارنامه هوش مصنوعی', value: stats?.report_cards?.with_ai || 0 },
                { label: 'کارنامه ۳۶۰ درجه', value: stats?.report_cards?.degree_360 || 0 },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
