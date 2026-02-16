'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import { useCreateTest, useUploadFile, useGetLanguages } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VARIANT_TYPES = [
  { value: 'self', label: 'خود (Self)' },
  { value: 'other', label: 'دیگری (Other)' },
];

const testSchema = z.object({
  slug: z.string().min(1, 'شناسه یکتا الزامی است'),
  is_active: z.boolean(),
  order: z.coerce.number().min(0, 'ترتیب باید عدد مثبت باشد'),
  image_id: z.number().nullable().optional(),
  icon_id: z.number().nullable().optional(),
  min_participants: z.coerce.number().min(0),
  max_participants: z.coerce.number().min(0),
  system_prompt: z.string().optional(),
  basic_report_text: z.string().optional(),
  allow_partner_generate_report: z.boolean(),
  variants: z
    .array(
      z.object({
        title: z.string().min(1, 'عنوان الزامی است'),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        invitation_text: z.string().optional(),
        telegram_text: z.string().optional(),
        start_text: z.string().optional(),
        end_text: z.string().optional(),
        variant_type: z.enum(['self', 'other']),
        language_id: z.coerce.number().min(1, 'زبان الزامی است'),
      })
    )
    .min(1, 'حداقل یک ترجمه الزامی است'),
});

// ----------------------------------------------------------------------

export function TestCreateForm({ onSuccess }) {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  const { mutateAsync: createTest, isPending } = useCreateTest();
  const { mutateAsync: uploadFile } = useUploadFile();

  const defaultValues = {
    slug: '',
    is_active: true,
    order: 0,
    image_id: null,
    icon_id: null,
    min_participants: 0,
    max_participants: 0,
    system_prompt: '',
    basic_report_text: '',
    allow_partner_generate_report: false,
    variants: [
      {
        title: '',
        subtitle: '',
        description: '',
        invitation_text: '',
        telegram_text: '',
        start_text: '',
        end_text: '',
        variant_type: 'self',
        language_id: '',
      },
    ],
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(testSchema),
  });

  const { control, handleSubmit, reset, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

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

  const handleIconUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploadingIcon(true);
    try {
      const response = await uploadFile(file);
      console.log('Icon upload response:', response);
      const fileId = response?.data?.id || response?.id;
      const fileUrl = response?.data?.url || response?.url;
      setValue('icon_id', fileId, { shouldValidate: true });
      setIconPreview(`${CONFIG.assetsDir}${fileUrl}`);
      toast.success('آیکون آپلود شد');
    } catch (error) {
      console.error('Icon upload error:', error);
      toast.error('خطا در آپلود آیکون');
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleRemoveIcon = () => {
    setValue('icon_id', null);
    setIconPreview(null);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        order: Number(data.order),
        min_participants: Number(data.min_participants),
        max_participants: Number(data.max_participants),
        variants: data.variants.map((v) => ({
          ...v,
          language_id: Number(v.language_id),
        })),
      };

      await createTest(formattedData);
      toast.success('آزمون با موفقیت ایجاد شد');
      reset();
      setImagePreview(null);
      setIconPreview(null);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ایجاد آزمون');
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

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            آیکون آزمون
          </Typography>
          {isUploadingIcon ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <CircularProgress size={24} />
            </Box>
          ) : iconPreview ? (
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                component="img"
                src={iconPreview}
                sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
              />
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={handleRemoveIcon}
                startIcon={<Iconify icon="mdi:delete" />}
              >
                حذف آیکون
              </Button>
            </Stack>
          ) : (
            <Button
              component="label"
              variant="outlined"
              startIcon={<Iconify icon="mdi:cloud-upload" />}
              sx={{ py: 2, px: 4 }}
            >
              انتخاب آیکون
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    handleIconUpload(Array.from(e.target.files));
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

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">ترجمه‌ها (Variants)</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() =>
              append({
                title: '',
                subtitle: '',
                description: '',
                invitation_text: '',
                telegram_text: '',
                start_text: '',
                end_text: '',
                variant_type: 'self',
                language_id: '',
              })
            }
          >
            افزودن ترجمه
          </Button>
        </Box>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              position: 'relative',
            }}
          >
            {fields.length > 1 && (
              <IconButton
                size="small"
                onClick={() => remove(index)}
                sx={{ position: 'absolute', top: 8, left: 8 }}
              >
                <Iconify icon="mdi:close" />
              </IconButton>
            )}

            <Stack spacing={2}>
              <Box
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}
              >
                <Field.Select name={`variants.${index}.language_id`} label="زبان" required>
                  {languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name} ({lang.code})
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name={`variants.${index}.variant_type`} label="نوع" required>
                  {VARIANT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Field.Text name={`variants.${index}.title`} label="عنوان" required />
              <Field.Text name={`variants.${index}.subtitle`} label="زیرعنوان" />
              <Field.Text
                name={`variants.${index}.description`}
                label="توضیحات"
                multiline
                rows={2}
              />
              <Field.Text
                name={`variants.${index}.invitation_text`}
                label="متن دعوت"
                placeholder="متنی که کاربران هنگام دعوت دوستان می‌بینند"
                helperText="این متن در صفحه دعوت نمایش داده می‌شود"
                multiline
                rows={3}
              />
              <Field.Text
                name={`variants.${index}.telegram_text`}
                label="متن تلگرام"
                placeholder="متنی که در تلگرام ارسال می‌شود"
                helperText="این متن برای اشتراک‌گذاری در تلگرام استفاده می‌شود"
                multiline
                rows={3}
              />
              <Field.Text
                name={`variants.${index}.start_text`}
                label="متن شروع"
                multiline
                rows={2}
              />
              <Field.Text
                name={`variants.${index}.end_text`}
                label="متن پایان"
                multiline
                rows={2}
              />
            </Stack>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ایجاد آزمون
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
