'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useGetLanguages, useAddTestVariants } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VARIANT_TYPES = [
  { value: 'self', label: 'خود (Self)' },
  { value: 'other', label: 'دیگری (Other)' },
];

const testVariantsSchema = z.object({
  variants: z.array(
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
  ).min(1, 'حداقل یک ترجمه الزامی است'),
});

// ----------------------------------------------------------------------

export function TestVariantsManager({ testId, existingVariants = [], onSuccess }) {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];

  const { mutateAsync: addVariants, isPending } = useAddTestVariants();

  const defaultValues = {
    variants: existingVariants.length > 0 
      ? existingVariants.map(v => ({
          title: v.title || '',
          subtitle: v.subtitle || '',
          description: v.description || '',
          invitation_text: v.invitation_text || '',
          telegram_text: v.telegram_text || '',
          start_text: v.start_text || '',
          end_text: v.end_text || '',
          variant_type: v.variant_type || 'self',
          language_id: v.language_id || '',
        }))
      : [{ 
          title: '', 
          subtitle: '', 
          description: '', 
          invitation_text: '',
          telegram_text: '',
          start_text: '', 
          end_text: '', 
          variant_type: 'self', 
          language_id: '' 
        }],
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(testVariantsSchema),
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    if (existingVariants.length > 0) {
      reset({
        variants: existingVariants.map(v => ({
          title: v.title || '',
          subtitle: v.subtitle || '',
          description: v.description || '',
          invitation_text: v.invitation_text || '',
          telegram_text: v.telegram_text || '',
          start_text: v.start_text || '',
          end_text: v.end_text || '',
          variant_type: v.variant_type || 'self',
          language_id: v.language_id || '',
        })),
      });
    }
  }, [existingVariants, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedVariants = data.variants.map((v) => ({
        title: v.title,
        subtitle: v.subtitle || null,
        description: v.description || null,
        invitation_text: v.invitation_text || null,
        telegram_text: v.telegram_text || null,
        start_text: v.start_text || null,
        end_text: v.end_text || null,
        variant_type: v.variant_type,
        language_id: Number(v.language_id),
      }));

      await addVariants({ id: testId, variants: formattedVariants });
      toast.success('ترجمه‌ها با موفقیت ذخیره شدند');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ذخیره ترجمه‌ها');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">مدیریت ترجمه‌های آزمون</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => append({ 
              title: '', 
              subtitle: '', 
              description: '', 
              invitation_text: '',
              telegram_text: '',
              start_text: '', 
              end_text: '', 
              variant_type: 'self', 
              language_id: '' 
            })}
          >
            افزودن ترجمه
          </Button>
        </Box>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2">ترجمه #{index + 1}</Typography>
              {fields.length > 1 && (
                <IconButton size="small" onClick={() => remove(index)} color="error">
                  <Iconify icon="mdi:delete" />
                </IconButton>
              )}
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
                <Field.Select name={`variants.${index}.language_id`} label="زبان" size="small">
                  {languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Select name={`variants.${index}.variant_type`} label="نوع" size="small">
                  {VARIANT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Field.Text name={`variants.${index}.title`} label="عنوان" required />
              <Field.Text name={`variants.${index}.subtitle`} label="زیرعنوان" />
              <Field.Text name={`variants.${index}.description`} label="توضیحات" multiline rows={3} />
              <Field.Text 
                name={`variants.${index}.invitation_text`} 
                label="متن دعوت" 
                placeholder="متنی که کاربران هنگام دعوت دوستان می‌بینند"
                multiline 
                rows={2} 
              />
              <Field.Text 
                name={`variants.${index}.telegram_text`} 
                label="متن تلگرام" 
                placeholder="متنی که در تلگرام ارسال می‌شود"
                multiline 
                rows={2} 
              />
              <Field.Text name={`variants.${index}.start_text`} label="متن شروع" multiline rows={2} />
              <Field.Text name={`variants.${index}.end_text`} label="متن پایان" multiline rows={2} />
            </Stack>
          </Box>
        ))}

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ذخیره همه ترجمه‌ها
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}