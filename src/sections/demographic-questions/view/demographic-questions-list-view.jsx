'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useGetDemographicQuestions, useDeleteDemographicQuestion } from 'src/api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function DemographicQuestionsListView() {
  const router = useRouter();

  const { data, isLoading } = useGetDemographicQuestions();
  const questions = data?.data || [];

  const { mutateAsync: deleteQuestion } = useDeleteDemographicQuestion();

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این سوال اطمینان دارید؟ تمام گزینه‌ها حذف خواهند شد.'))
      return;

    try {
      await deleteQuestion(id);
      toast.success('سوال با موفقیت حذف شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف سوال');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">سوالات دموگرافیک</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => router.push(paths.dashboard.demographicQuestion.create)}
        >
          ایجاد سوال
        </Button>
      </Stack>

      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>متن سوال</TableCell>
                    <TableCell>تعداد گزینه</TableCell>
                    <TableCell>ترتیب</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell>Onboarding</TableCell>
                    <TableCell align="left">عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          هیچ سوالی یافت نشد
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.map((question) => (
                      <TableRow key={question.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{question.text}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {question.options?.length || 0} گزینه
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{question.display_order}</Typography>
                        </TableCell>
                        <TableCell>
                          <Label color={question.is_active ? 'success' : 'error'}>
                            {question.is_active ? 'فعال' : 'غیرفعال'}
                          </Label>
                        </TableCell>
                        <TableCell>
                          <Label color={question.show_on_onboarding ? 'info' : 'default'}>
                            {question.show_on_onboarding ? 'بله' : 'خیر'}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                router.push(paths.dashboard.demographicQuestion.edit(question.id))
                              }
                            >
                              <Iconify icon="mdi:pencil" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(question.id)}
                            >
                              <Iconify icon="mdi:delete" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
      </Card>
    </Box>
  );
}
