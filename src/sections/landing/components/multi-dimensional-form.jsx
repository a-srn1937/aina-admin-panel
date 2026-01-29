'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import { useGetMultiDimensional, useUpdateMultiDimensional, useUploadFile, useGetLanguages } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const multiDimensionalSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  content: z.string().optional(),
  puzzle_image_url: z.string().optional(),
  cta_text: z.string().optional(),
  language_id: z.coerce.number().min(1, 'زبان الزامی است'),
});

export function MultiDimensionalForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];
  const { data: multiDimensionalData, isLoading } = useGetMultiDimensional();
  const { mutateAsync: updateMultiDimensional, isPending } = useUpdateMultiDimensional();
  const { mutateAsync: uploadFile } = useUploadFile();

  const methods = useForm({
    defaultValues: {
      title: '',
      content: '',
      puzzle_image_url: '',
      cta_text: '',
      language_id: '',
    },
    resolver: zodResolver(multiDimensionalSchema),
  });

  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    if (multiDimensionalData?.data) {
      const data = multiDimensionalData.data;
      reset({
        title: data.title || '',
        content: data.content || '',
        puzzle_image_url: data.puzzle_image_url || '',
        cta_text: data.cta_text || '',
        language_id: data.language_id || '',
      });

      if (data.puzzle_image_url) {
        const imageUrl = data.puzzle_image_url.startsWith('http')
          ? data.puzzle_image_url
          : `${CONFIG.assetsDir}${data.puzzle_image_url.startsWith('/') ? data.puzzle_image_url : `/${data.puzzle_image_url}`}`;
        setImagePreview(imageUrl);
      }
    }
  }, [multiDimensionalData, reset]);

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      const fileUrl = response?.data?.url || response?.url;
      setValue('puzzle_image_url', fileUrl);

      const previewUrl = fileUrl.startsWith('http')
        ? fileUrl
        : `${CONFIG.assetsDir}${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`;
      setImagePreview(previewUrl);

      toast.success('تصویر آپلود شد');
    } catch (error) {
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('puzzle_image_url', '');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateMultiDimensional(data);
      toast.success('Multi-Dimensional با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره');
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Field.Text name="title" label="عنوان" required />
        <Field.Text name="content" label="محتوا" multiline rows={5} />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            تصویر پازل
          </Typography>
          {isUploading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : imagePreview ? (
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box component="img" src={imagePreview} sx={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 1 }} />
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={handleRemoveImage}
                startIcon={<Iconify icon="mdi:delete" />}
              >
                حذف تصویر
              </Button>
            </Stack>
          ) : (
            <Button component="label" variant="outlined" startIcon={<Iconify icon="mdi:cloud-upload" />}>
              انتخاب تصویر
              <input type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files) handleImageUpload(Array.from(e.target.files)); }} />
            </Button>
          )}
        </Box>

        <Field.Text name="cta_text" label="متن دکمه" />

        <Field.Select name="language_id" label="زبان" required>
          {languages.map((lang) => (
            <MenuItem key={lang.id} value={lang.id}>
              {lang.name}
            </MenuItem>
          ))}
        </Field.Select>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ذخیره تغییرات
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
