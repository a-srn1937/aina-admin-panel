import { TestDetailsView } from 'src/sections/tests/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'جزئیات آزمون | Aina Admin',
};

export default function Page({ params }) {
  return <TestDetailsView testId={params.testId} />;
}
