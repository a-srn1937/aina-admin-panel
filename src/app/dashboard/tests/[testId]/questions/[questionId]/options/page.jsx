import { QuestionOptionsView } from 'src/sections/tests/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'مدیریت گزینه‌ها | Aina Admin',
};

export default function Page({ params }) {
  return <QuestionOptionsView testId={params.testId} questionId={params.questionId} />;
}
