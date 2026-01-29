'use client';

import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { DemographicQuestionForm } from '../components';

// ----------------------------------------------------------------------

export function DemographicQuestionCreateView() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(paths.dashboard.demographicQuestion.root);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<Iconify icon="mdi:arrow-right" />}
          onClick={() => router.back()}
        >
          بازگشت
        </Button>
        <Typography variant="h4">ایجاد سوال دموگرافیک</Typography>
      </Stack>

      <DemographicQuestionForm onSuccess={handleSuccess} />
    </Box>
  );
}
