import { _mock } from './_mock';
import { SHARED_PERSONS } from './_files';

// ----------------------------------------------------------------------

export const ACTION_TYPE_OPTIONS = ['مالی', 'استراتژیک', 'عملیاتی'];

// ----------------------------------------------------------------------

export const ACTION_STATUS_OPTIONS = {
  pending: {
    label: 'در حال انجام',
    color: 'info',
    icon: 'solar:clock-circle-outline',
  },
  approved: {
    label: 'تصویب شده',
    color: 'success',
    icon: 'eva:checkmark-fill',
  },
  rejected: {
    label: 'رد شده',
    color: 'error',
    icon: 'mingcute:close-line',
  },
};

// ----------------------------------------------------------------------

export const ACTIONS = [
  {
    id: _mock.id(1),
    title: 'انتصاب شرکت میزان به عنوان بازرس اصلی',
    subtitle: null,
    type: ACTION_TYPE_OPTIONS[0],
    createdAt: _mock.time(1),
    decisionMakers: SHARED_PERSONS.slice(0, 5),
    status: 'pending',
    voted: false,
  },
  {
    id: _mock.id(2),
    title: 'تصویب شرایط جدید دور کاری',
    subtitle: 'برنامه منابع انسانی',
    type: ACTION_TYPE_OPTIONS[1],
    createdAt: _mock.time(2),
    decisionMakers: SHARED_PERSONS.slice(0, 5),
    status: 'approved',
    voted: true,
  },
  {
    id: _mock.id(3),
    title: 'تصویب سرمایه گذاری بر روی زیگپ',
    subtitle: 'کمیته سرمایه گذاری',
    type: ACTION_TYPE_OPTIONS[2],
    createdAt: _mock.time(3),
    decisionMakers: SHARED_PERSONS.slice(0, 5),
    status: 'rejected',
    voted: true,
  },
  {
    id: _mock.id(4),
    title: 'تایید مشارکت در صندوق سرمایه گذاری پیشگام سوم',
    subtitle: 'توسعه مشارکت های سازمانی',
    type: ACTION_TYPE_OPTIONS[2],
    createdAt: _mock.time(4),
    decisionMakers: SHARED_PERSONS.slice(1, 6),
    status: 'pending',
    voted: true,
  },
];
