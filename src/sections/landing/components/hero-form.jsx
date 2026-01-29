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
import { useGetHero, useUpdateHero, useUploadFile, useGetLanguages } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const heroSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  subtitle: z.string().optional(),
  image_url: z.string().optional(),
  cta_text: z.string().optional(),
  language_id: z.coerce.number().min(1, 'زبان الزامی است'),
});

export function HeroForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];
  const { data: heroData, isLoading } = useGetHero();
  const { mutateAsync: updateHero, isPending } = useUpdateHero();
  const { mutateAsync: uploadFile } = useUploadFile();

  const methods = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      image_url: '',
      cta_text: '',
      language_id: '',
    },
    resolver: zodResolver(heroSchema),
  });

  const { handleSubmit, setValue, reset } = methods;

  // Load existing data
  useEffect(() => {
    if (heroData?.data) {
      const hero = heroData.data;
      reset({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        image_url: hero.image_url || '',
        cta_text: hero.cta_text || '',
        language_id: hero.language_id || '',
      });
      
      // Set image preview - check if it's a full URL or path
      if (hero.image_url) {
        // If it starts with http, use it directly, otherwise prepend assetsDir
        const imageUrl = hero.image_url.startsWith('http') 
          ? hero.image_url 
          : `${CONFIG.assetsDir}${hero.image_url.startsWith('/') ? hero.image_url : `/${hero.image_url}`}`;
        setImagePreview(imageUrl);
      }
    }
  }, [heroData, reset]);

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      console.log('Upload response:', response);
      const fileUrl = response?.data?.url || response?.url;
      setValue('image_url', fileUrl);
      
      // Set preview with proper URL handling
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
    setValue('image_url', '');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateHero(data);
      toast.success('Hero Section با موفقیت ذخیره شد');
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
        <Field.Text name="subtitle" label="زیرنویس" multiline rows={3} />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            تصویر
          </Typography>
          {isUploading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 3,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : imagePreview ? (
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                component="img"
                src={imagePreview}
                sx={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 1 }}
              />
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
            <Button
              component="label"
              variant="outlined"
              startIcon={<Iconify icon="mdi:cloud-upload" />}
              sx={{ py: 2, px: 4 }}
            >
              انتخاب تصویر
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files) handleImageUpload(Array.from(e.target.files));
                }}
              />
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
