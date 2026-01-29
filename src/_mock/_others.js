import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _carouselsMembers = Array.from({ length: 6 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  title: `Questions ${index + 1}`,
  content: _mock.description(index),
}));

// ----------------------------------------------------------------------

export const _addressBooks = Array.from({ length: 24 }, (_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyNames(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = Array.from({ length: 20 }, (_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'always') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _mock.id(1),
    title: 'جلسه هیئت مدیره فصلی',
    description: 'جلسه فصلی هیئت مدیره شرکت فردا ساعت 10 صبح در سالن کنفرانس اصلی برگزار می‌شود.',
    avatarUrl: _mock.image.avatar(1),
    type: 'meeting',
    category: 'هیئت مدیره',
    isUnRead: true,
    createdAt: new Date(),
  },
  {
    id: _mock.id(2),
    title: 'تصویب صورت‌جلسه قبلی',
    description: 'صورت‌جلسه جلسه قبل هیئت مدیره تایید و بایگانی شد.',
    avatarUrl: _mock.image.avatar(2),
    type: 'approval',
    category: 'هیئت مدیره',
    isUnRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: _mock.id(3),
    title: 'دعوت به جلسه فوق‌العاده',
    description: 'به جلسه فوق‌العاده هیئت مدیره در تاریخ 1402/06/20 دعوت شده‌اید.',
    avatarUrl: _mock.image.avatar(3),
    type: 'invitation',
    category: 'هیئت مدیره',
    isUnRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: _mock.id(4),
    title: 'بررسی عملکرد مالی سه‌ماهه',
    description: 'گزارش عملکرد مالی سه‌ماهه اول سال برای بررسی در پنل مدیریت بارگذاری شد.',
    avatarUrl: _mock.image.avatar(4),
    type: 'report',
    category: 'مالی',
    isUnRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: _mock.id(5),
    title: 'تغییر در ترکیب هیئت مدیره',
    description: 'اعضای جدید هیئت مدیره شرکت معرفی شدند.',
    avatarUrl: _mock.image.avatar(5),
    type: 'update',
    category: 'هیئت مدیره',
    isUnRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: _mock.id(6),
    title: 'برنامه‌ریزی جلسه بعدی',
    description: 'زمان‌های پیشنهادی برای جلسه بعدی هیئت مدیره را تایید کنید.',
    avatarUrl: null,
    type: 'schedule',
    category: 'هیئت مدیره',
    isUnRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
  },
  {
    id: _mock.id(7),
    title: 'مصوبات جلسه گذشته',
    description: 'مصوبات جلسه قبلی هیئت مدیره برای تایید نهایی ارسال شد.',
    avatarUrl: null,
    type: 'minutes',
    category: 'هیئت مدیره',
    isUnRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: _mock.id(8),
    title: 'به‌روزرسانی اساسنامه',
    description: 'پیش‌نویس اصلاحات اساسنامه برای بررسی اعضا ارسال شد.',
    avatarUrl: null,
    type: 'document',
    category: 'اسناد',
    isUnRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
  },
  {
    id: _mock.id(9),
    title: 'گزارش عملکرد مدیرعامل',
    description: 'گزارش عملکرد سه‌ماهه مدیرعامل در پنل مدیریت بارگذاری شد.',
    avatarUrl: null,
    type: 'report',
    category: 'مدیریتی',
    isUnRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
  },
];

// ----------------------------------------------------------------------

export const _mapContact = [
  { latlng: [33, 65], address: _mock.fullAddress(1), phoneNumber: _mock.phoneNumber(1) },
  { latlng: [-12.5, 18.5], address: _mock.fullAddress(2), phoneNumber: _mock.phoneNumber(2) },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    label: 'Facebook',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    label: 'Twitter',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

// ----------------------------------------------------------------------

export const _pricingPlans = [
  {
    subscription: 'basic',
    price: 0,
    caption: 'Forever',
    lists: ['3 prototypes', '3 boards', 'Up to 5 team members'],
    labelAction: 'Current plan',
  },
  {
    subscription: 'starter',
    price: 4.99,
    caption: 'Saving $24 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
    ],
    labelAction: 'Choose starter',
  },
  {
    subscription: 'premium',
    price: 9.99,
    caption: 'Saving $124 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
      'Issue development license',
      'Permissions & workflows',
    ],
    labelAction: 'Choose premium',
  },
];

// ----------------------------------------------------------------------

export const _testimonials = [
  {
    name: _mock.fullName(1),
    postedDate: _mock.time(1),
    ratingNumber: _mock.number.rating(1),
    avatarUrl: _mock.image.avatar(1),
    content: `Excellent Work! Thanks a lot!`,
  },
  {
    name: _mock.fullName(2),
    postedDate: _mock.time(2),
    ratingNumber: _mock.number.rating(2),
    avatarUrl: _mock.image.avatar(2),
    content: `It's a very good dashboard and we are really liking the product . We've done some things, like migrate to TS and implementing a react useContext api, to fit our job methodology but the product is one of the best in terms of design and application architecture. The team did a really good job.`,
  },
  {
    name: _mock.fullName(3),
    postedDate: _mock.time(3),
    ratingNumber: _mock.number.rating(3),
    avatarUrl: _mock.image.avatar(3),
    content: `Customer support is realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`,
  },
  {
    name: _mock.fullName(4),
    postedDate: _mock.time(4),
    ratingNumber: _mock.number.rating(4),
    avatarUrl: _mock.image.avatar(4),
    content: `Amazing, really good code quality and gives you a lot of examples for implementations.`,
  },
  {
    name: _mock.fullName(5),
    postedDate: _mock.time(5),
    ratingNumber: _mock.number.rating(5),
    avatarUrl: _mock.image.avatar(5),
    content: `Got a few questions after purchasing the product. The owner responded very fast and very helpfull. Overall the code is excellent and works very good. 5/5 stars!`,
  },
  {
    name: _mock.fullName(6),
    postedDate: _mock.time(6),
    ratingNumber: _mock.number.rating(6),
    avatarUrl: _mock.image.avatar(6),
    content: `CEO of Codealy.io here. We’ve built a developer assessment platform that makes sense - tasks are based on git repositories and run in virtual machines. We automate the pain points - storing candidates code, running it and sharing test results with the whole team, remotely. Bought this template as we need to provide an awesome dashboard for our early customers. I am super happy with purchase. The code is just as good as the design. Thanks!`,
  },
];
