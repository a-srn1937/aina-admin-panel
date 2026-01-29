import { _mock } from './_mock';
import { SHARED_PERSONS } from './_files';

export const POST_PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

export const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

const _courseTitles = ['تعالی رهبری', 'استراتژی، نوآوری و مدیریت', 'مبانی تصمیم‌گیری استراتژیک'];
const _courseSubtitles = [
  'مدیریت اختلافات و تصمیم‌گیری‌های مشارکتی',
  'ایجاد محیط پویا برای بحث و گفتگو',
  'اخلاق و مسئولیت اجتماعی در رهبری حاکمیت',
];

export const _courses = _courseTitles.map((title, index) => ({
  id: `${_mock.id(index)}_file`,
  title,
  subtitle: _courseSubtitles[index],
  author: SHARED_PERSONS[index],
  modifiedAt: _mock.time(index),
  coverUrl: _mock.image.roadmap(index),
}));
