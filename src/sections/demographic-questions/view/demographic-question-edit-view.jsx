'use client';

import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useGetDemographicQuestionById } from 'src/api';

import { Iconify } from 'src/components/iconify';

import { DemographicQuestionForm } from '../components';

// ----------------------------------------------------------------------

export function DemographicQuestionEditView({ id }) {
  const router = useRouter();

  const { data, isLoading } = useGetDemographicQuestionById(id);
  const question = data?.data;

  const handleSuccess = () => {
    router.push(paths.dashboard.demographicQuestion.root);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<Iconify icon="mdi:arrow-right" />}
          onClick={() => router.back()}
        >
          بازگشت
        </Button>
        <Typography variant="h4">ویرایش سوال دموگرافیک</Typography>
      </Stack>

      <DemographicQuestionForm question={question} onSuccess={handleSuccess} />
    </Box>
  );
}
