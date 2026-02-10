import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export const ICONS = {
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  course: icon('ic-course'),
  dashboard: icon('ic-dashboard'),
  invoice: icon('ic-invoice'),
  analytics: icon('ic-analytics'),
  chat: icon('ic-chat'),
};

// ----------------------------------------------------------------------

export const useNavItems = () =>
  useMemo(
    () => [
      {
        subheader: 'داشبورد',
        items: [
          {
            title: 'خانه',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: 'مدیریت',
        items: [
          {
            title: 'کاربران',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
          },
          {
            title: 'آزمون‌ها',
            path: paths.dashboard.test.root,
            icon: ICONS.course,
          },
          {
            title: 'پرداخت‌ها',
            path: paths.dashboard.payment.root,
            icon: ICONS.invoice,
          },
          {
            title: 'سرویس‌ها',
            path: paths.dashboard.service.root,
            icon: ICONS.file,
          },
          // {
          //   title: 'شاخص‌ها',
          //   path: paths.dashboard.index.root,
          //   icon: ICONS.analytics,
          // },
          {
            title: 'پیام‌ها',
            path: paths.dashboard.feedback.root,
            icon: ICONS.chat,
          },
          {
            title: 'امتیازها',
            path: paths.dashboard.rating.root,
            icon: ICONS.analytics,
          },
        ],
      },
      {
        subheader: 'تنظیمات',
        items: [
          {
            title: 'دسته‌بندی تگ‌ها',
            path: paths.dashboard.tagCategory.root,
            icon: ICONS.file,
          },
          {
            title: 'تگ‌ها',
            path: paths.dashboard.tag.root,
            icon: ICONS.file,
          },
          {
            title: 'سوالات دموگرافیک',
            path: paths.dashboard.demographicQuestion.root,
            icon: ICONS.file,
          },
          {
            title: 'عبارات سامانه',
            path: paths.dashboard.siteContent.root,
            icon: ICONS.file,
          },
          {
            title: 'لندینگ پیج',
            path: paths.dashboard.landing.root,
            icon: ICONS.course,
          },
        ],
      },
    ],
    []
  );

export const useNavItemsMini = () => useMemo(() => [], []);
