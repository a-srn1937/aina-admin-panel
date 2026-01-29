'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  useDeleteOption,
  useGetQuestionById,
  useGetOptionsByQuestion,
} from 'src/api';

import { Iconify } from 'src/components/iconify';

import { OptionForm } from '../components/option-form';
import { OptionVariantEditForm } from '../components/variant-edit-form';
import { OptionVariantsManager } from '../components/option-variants-manager';

// ----------------------------------------------------------------------

export function QuestionOptionsView({ testId, questionId }) {
  const [openAddOption, setOpenAddOption] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [managingOptionVariants, setManagingOptionVariants] = useState(null);

  const { data: question, isLoading: questionLoading } = useGetQuestionById(questionId);
  const {
    data: optionsData,
    isLoading: optionsLoading,
    refetch: refetchOptions,
  } = useGetOptionsByQuestion(questionId);

  const { mutateAsync: deleteOption } = useDeleteOption();

  const options = optionsData || [];

  const handleDeleteOption = async (optionId) => {
    if (!window.confirm('آیا از حذف این گزینه اطمینان دارید؟')) return;
    try {
      await deleteOption(optionId);
      toast.success('گزینه حذف شد');
      refetchOptions();
    } catch (error) {
      toast.error('خطا در حذف گزینه');
    }
  };

  const handleCloseForm = () => {
    setOpenAddOption(false);
    setEditingOption(null);
    refetchOptions();
  };

  if (questionLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>سوال یافت نشد</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.test.details(testId)}
          startIcon={<Iconify icon="mdi:arrow-right" />}
          sx={{ mb: 1 }}
        >
          بازگشت به جزئیات آزمون
        </Button>
        <Typography variant="h4">مدیریت گزینه‌ها</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          سوال: {question.variants?.[0]?.text || 'بدون متن'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => setOpenAddOption(true)}
        >
          افزودن گزینه
        </Button>
      </Box>

      {optionsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : options.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">گزینه‌ای یافت نشد</Typography>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ترتیب</TableCell>
                  <TableCell>متن گزینه</TableCell>
                  <TableCell>امتیاز</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell align="left">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>{option.order}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {option.variants?.map((v, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={v.language?.name || `زبان ${v.language_id}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={v.variant_type === 'self' ? 'خود' : 'دیگری'}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>{v.text}</Typography>
                            <IconButton size="small" onClick={() => setEditingVariant(v)}>
                              <Iconify icon="mdi:pencil" width={16} />
                            </IconButton>
                          </Box>
                        ))}
                        {(!option.variants || option.variants.length === 0) && '-'}
                      </Stack>
                    </TableCell>
                    <TableCell>{option.score}</TableCell>
                    <TableCell>
                      <Chip
                        label={option.is_active ? 'فعال' : 'غیرفعال'}
                        size="small"
                        color={option.is_active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => setManagingOptionVariants(option)}
                        title="مدیریت کلی ترجمه‌ها"
                      >
                        <Iconify icon="mdi:translate" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setEditingOption(option)}
                      >
                        <Iconify icon="mdi:pencil" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteOption(option.id)}
                      >
                        <Iconify icon="mdi:delete" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add/Edit Option Dialog */}
      <Dialog
        open={openAddOption || !!editingOption}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingOption ? 'ویرایش گزینه' : 'افزودن گزینه جدید'}
        </DialogTitle>
        <DialogContent>
          <OptionForm
            questionId={questionId}
            option={editingOption}
            onSuccess={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Option Variant Dialog */}
      <Dialog open={!!editingVariant} onClose={() => setEditingVariant(null)} maxWidth="sm" fullWidth>
        <DialogTitle>ویرایش ترجمه گزینه</DialogTitle>
        <DialogContent>
          {editingVariant && (
            <OptionVariantEditForm
              variant={editingVariant}
              onSuccess={() => {
                setEditingVariant(null);
                refetchOptions();
              }}
              onCancel={() => setEditingVariant(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog 
        open={!!managingOptionVariants} 
        onClose={() => setManagingOptionVariants(null)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>مدیریت کلی ترجمه‌های گزینه</DialogTitle>
        <DialogContent>
          {managingOptionVariants && (
            <OptionVariantsManager
              optionId={managingOptionVariants.id}
              existingVariants={managingOptionVariants?.variants || []}
              onSuccess={() => {
                setManagingOptionVariants(null);
                refetchOptions();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManagingOptionVariants(null)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
