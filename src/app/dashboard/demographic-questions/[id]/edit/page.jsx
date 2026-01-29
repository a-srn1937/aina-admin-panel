import { DemographicQuestionEditView } from 'src/sections/demographic-questions';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'ویرایش سوال دموگرافیک',
};

// ----------------------------------------------------------------------

export default function DemographicQuestionEditPage({ params }) {
  const { id } = params;

  return <DemographicQuestionEditView id={id} />;
}
