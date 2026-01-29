'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import { useUpdateTest, useUploadFile } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const testSchema = z.object({
  slug: z.string().min(1, 'شناسه یکتا الزامی است'),
  is_active: z.boolean(),
  order: z.coerce.number().min(0, 'ترتیب باید عدد مثبت باشد'),
  image_id: z.number().nullable().optional(),
  min_participants: z.coerce.number().min(0),
  max_participants: z.coerce.number().min(0),
  system_prompt: z.string().optional(),
  basic_report_text: z.string().optional(),
  allow_partner_generate_report: z.boolean(),
});

// ----------------------------------------------------------------------

export function TestEditForm({ test, onSuccess }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: updateTest, isPending } = useUpdateTest();
  const { mutateAsync: uploadFile } = useUploadFile();

  const defaultValues = {
    slug: test?.slug || '',
    is_active: test?.is_active ?? true,
    order: test?.order || 0,
    image_id: test?.image_id || null,
    min_participants: test?.min_participants || 0,
    max_participants: test?.max_participants || 0,
    system_prompt: test?.system_prompt || '',
    basic_report_text: test?.basic_report_text || '',
    allow_partner_generate_report: test?.allow_partner_generate_report ?? false,
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(testSchema),
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (test) {
      reset({
        slug: test.slug || '',
        is_active: test.is_active ?? true,
        order: test.order || 0,
        image_id: test.image_id || null,
        min_participants: test.min_participants || 0,
        max_participants: test.max_participants || 0,
        system_prompt: test.system_prompt || '',
        basic_report_text: test.basic_report_text || '',
        allow_partner_generate_report: test.allow_partner_generate_report ?? false,
      });

      // Set image preview from existing image_file
      if (test.image_file) {
        setImagePreview(`${CONFIG.assetsDir}/${test.image_file.path}`);
      } else if (test.image) {
        // Legacy: if image is a string URL
        setImagePreview(test.image);
      }
    }
  }, [test, reset]);

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      console.log('Upload response:', response);
      const fileId = response?.data?.id || response?.id;
      const fileUrl = response?.data?.url || response?.url;
      setValue('image_id', fileId, { shouldValidate: true });
      setImagePreview(`${CONFIG.assetsDir}${fileUrl}`);
      toast.success('تصویر آپلود شد');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue('image_id', null);
    setImagePreview(null);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        order: Number(data.order),
        min_participants: Number(data.min_participants),
        max_participants: Number(data.max_participants),
      };

      await updateTest({ id: test.id, data: formattedData });
      toast.success('آزمون با موفقیت ویرایش شد');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ویرایش آزمون');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Typography variant="subtitle1">اطلاعات پایه</Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Field.Text name="slug" label="شناسه یکتا (slug)" required />
          <Field.Text name="order" label="ترتیب" type="number" />
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Field.Text name="min_participants" label="حداقل شرکت‌کنندگان" type="number" />
          <Field.Text name="max_participants" label="حداکثر شرکت‌کنندگان" type="number" />
        </Box>

        <Field.Text name="system_prompt" label="پرامپت سیستم (AI)" multiline rows={3} />

        <Field.Text 
          name="basic_report_text" 
          label="متن کارنامه اولیه" 
          multiline 
          rows={4}
          placeholder="این متن گزارش اولیه شماست که بدون پرداخت قابل مشاهده است..."
          helperText="متنی که به عنوان گزارش اولیه (رایگان) به کاربر نمایش داده می‌شود"
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            تصویر آزمون
          </Typography>
          {isUploading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
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
                  if (e.target.files) {
                    handleImageUpload(Array.from(e.target.files));
                  }
                }}
              />
            </Button>
          )}
        </Box>

        <Field.Switch name="is_active" label="فعال" />

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            فقط برای آزمون‌های ۲ نفره
          </Typography>
          <Field.Switch name="allow_partner_generate_report" label="ساخت کارنامه بدون تایید" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ذخیره تغییرات
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
