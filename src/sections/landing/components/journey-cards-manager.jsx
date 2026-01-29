'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import {
  useGetJourneys,
  useUploadFile,
  useCreateJourney,
  useUpdateJourney,
  useDeleteJourney,
  useGetLanguages,
  useReorderJourneys,
} from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';

const journeySchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  description: z.string().optional(),
  icon_url: z.string().optional(),
  display_order: z.coerce.number().min(0),
  language_id: z.coerce.number().min(1, 'زبان الزامی است'),
});

export function JourneyCardsManager() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editingJourney, setEditingJourney] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fa');

  const { data, isLoading } = useGetJourneys(selectedLanguage);
  const journeys = data?.data || [];

  const { mutateAsync: deleteJourney } = useDeleteJourney();

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این کارت اطمینان دارید؟')) return;
    try {
      await deleteJourney(id);
      toast.success('کارت حذف شد');
    } catch (error) {
      toast.error('خطا در حذف');
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">کارت‌های مسیر</Typography>
      </Stack>

      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>عنوان</TableCell>
                    <TableCell>توضیحات</TableCell>
                    <TableCell>ترتیب</TableCell>
                    <TableCell align="left">عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {journeys.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          هیچ کارتی یافت نشد
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    journeys.map((journey) => (
                      <TableRow key={journey.id} hover>
                        <TableCell>{journey.title}</TableCell>
                        <TableCell>{journey.description}</TableCell>
                        <TableCell>{journey.display_order}</TableCell>
                        <TableCell align="left">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" color="primary" onClick={() => setEditingJourney(journey)}>
                              <Iconify icon="mdi:pencil" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(journey.id)}>
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

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>افزودن کارت جدید</DialogTitle>
        <DialogContent>
          <JourneyForm onSuccess={() => setOpenCreate(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingJourney} onClose={() => setEditingJourney(null)} maxWidth="sm" fullWidth>
        <DialogTitle>ویرایش کارت</DialogTitle>
        <DialogContent>
          <JourneyForm journey={editingJourney} onSuccess={() => setEditingJourney(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function JourneyForm({ journey, onSuccess }) {
  const [iconPreview, setIconPreview] = useState(journey?.icon_url ? `${CONFIG.assetsDir}${journey.icon_url}` : null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];
  const { mutateAsync: createJourney, isPending: isCreating } = useCreateJourney();
  const { mutateAsync: updateJourney, isPending: isUpdating } = useUpdateJourney();
  const { mutateAsync: uploadFile } = useUploadFile();

  const methods = useForm({
    defaultValues: {
      title: journey?.title || '',
      description: journey?.description || '',
      icon_url: journey?.icon_url || '',
      display_order: journey?.display_order || 0,
      language_id: journey?.language_id || '',
    },
    resolver: zodResolver(journeySchema),
  });

  const { handleSubmit, setValue } = methods;

  const handleIconUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      const fileUrl = response?.data?.url || response?.url;
      setValue('icon_url', fileUrl);
      setIconPreview(`${CONFIG.assetsDir}${fileUrl}`);
      toast.success('آیکون آپلود شد');
    } catch (error) {
      toast.error('خطا در آپلود');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (journey) {
        await updateJourney({ id: journey.id, data });
        toast.success('کارت ویرایش شد');
      } else {
        await createJourney(data);
        toast.success('کارت ایجاد شد');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('خطا در ذخیره');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Field.Text name="title" label="عنوان" required />
        <Field.Text name="description" label="توضیحات" multiline rows={3} />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            آیکون
          </Typography>
          {isUploading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : iconPreview ? (
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box component="img" src={iconPreview} sx={{ width: 80, height: 80, objectFit: 'contain' }} />
              <Button size="small" color="error" variant="outlined" onClick={() => { setIconPreview(null); setValue('icon_url', ''); }}>
                حذف
              </Button>
            </Stack>
          ) : (
            <Button component="label" variant="outlined" startIcon={<Iconify icon="mdi:cloud-upload" />}>
              انتخاب آیکون
              <input type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files) handleIconUpload(Array.from(e.target.files)); }} />
            </Button>
          )}
        </Box>

        <Field.Text name="display_order" label="ترتیب نمایش" type="number" />

        <Field.Select name="language_id" label="زبان" required>
          {languages.map((lang) => (
            <MenuItem key={lang.id} value={lang.id}>
              {lang.name}
            </MenuItem>
          ))}
        </Field.Select>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" loading={isCreating || isUpdating}>
            {journey ? 'ذخیره تغییرات' : 'ایجاد کارت'}
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
