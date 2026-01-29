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

const _blogTitles = ['توسعه شخصی', 'توسعه شخصی', 'مدیریت'];
const _blogSubtitles = [
  'چالش های هیئت مدیره در عصر دورکاری ....',
  'تغییرات در مصوبات حسابرسی شرکت بورس',
  'راهکار های رهبری فراتر از نقش در جلسات هیئت مدیره...',
];

export const _blogs = _blogTitles.map((title, index) => ({
  id: `${_mock.id(index)}_file`,
  title,
  subtitle: _blogSubtitles[index],
  author: SHARED_PERSONS[index],
  modifiedAt: _mock.time(index),
  coverUrl: _mock.image.course(index + 1),
}));
