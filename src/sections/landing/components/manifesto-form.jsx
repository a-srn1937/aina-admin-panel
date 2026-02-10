'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import { useUploadFile, useGetManifesto, useGetLanguages, useUpdateManifesto } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const manifestoSchema = z.object({
  content: z.string().min(1, 'محتوا الزامی است'),
  background_image_url: z.string().optional(),
  language_id: z.coerce.number().min(1, 'زبان الزامی است'),
});

export function ManifestoForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];
  const { data: manifestoData, isLoading } = useGetManifesto();
  const { mutateAsync: updateManifesto, isPending } = useUpdateManifesto();
  const { mutateAsync: uploadFile } = useUploadFile();

  const methods = useForm({
    defaultValues: {
      content: '',
      background_image_url: '',
      language_id: '',
    },
    resolver: zodResolver(manifestoSchema),
  });

  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    if (manifestoData?.data) {
      const manifesto = manifestoData.data;
      reset({
        content: manifesto.content || '',
        background_image_url: manifesto.background_image_url || '',
        language_id: manifesto.language_id || '',
      });

      if (manifesto.background_image_url) {
        const imageUrl = manifesto.background_image_url.startsWith('http')
          ? manifesto.background_image_url
          : `${CONFIG.assetsDir}${manifesto.background_image_url.startsWith('/') ? manifesto.background_image_url : `/${manifesto.background_image_url}`}`;
        setImagePreview(imageUrl);
      }
    }
  }, [manifestoData, reset]);

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      console.log('Upload response:', response);
      const fileUrl = response?.data?.url || response?.url;
      setValue('background_image_url', fileUrl);

      const previewUrl = fileUrl.startsWith('http')
        ? fileUrl
        : `${CONFIG.assetsDir}${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`;
      setImagePreview(previewUrl);

      toast.success('تصویر آپلود شد');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('background_image_url', '');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateManifesto(data);
      toast.success('Manifesto با موفقیت ذخیره شد');
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
        <Field.Text name="content" label="محتوا" multiline rows={8} required />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            تصویر پس‌زمینه
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
