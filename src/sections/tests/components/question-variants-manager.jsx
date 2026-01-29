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

import { useGetLanguages, useAddQuestionVariants } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VARIANT_TYPES = [
  { value: 'self', label: 'خود (Self)' },
  { value: 'other', label: 'دیگری (Other)' },
];

const questionVariantsSchema = z.object({
  variants: z.array(
    z.object({
      text: z.string().min(1, 'متن سوال الزامی است'),
      variant_type: z.enum(['self', 'other']),
      language_id: z.coerce.number().min(1, 'زبان الزامی است'),
    })
  ).min(1, 'حداقل یک ترجمه الزامی است'),
});

// ----------------------------------------------------------------------

export function QuestionVariantsManager({ questionId, existingVariants = [], onSuccess }) {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];

  const { mutateAsync: addVariants, isPending } = useAddQuestionVariants();

  const defaultValues = {
    variants: existingVariants.length > 0 
      ? existingVariants.map(v => ({
          text: v.text || '',
          variant_type: v.variant_type || 'self',
          language_id: v.language_id || '',
        }))
      : [{ text: '', variant_type: 'self', language_id: '' }],
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(questionVariantsSchema),
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
          text: v.text || '',
          variant_type: v.variant_type || 'self',
          language_id: v.language_id || '',
        })),
      });
    }
  }, [existingVariants, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedVariants = data.variants.map((v) => ({
        text: v.text,
        variant_type: v.variant_type,
        language_id: Number(v.language_id),
      }));

      await addVariants({ id: questionId, variants: formattedVariants });
      toast.success('ترجمه‌های سوال با موفقیت ذخیره شدند');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ذخیره ترجمه‌های سوال');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">مدیریت ترجمه‌های سوال</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => append({ text: '', variant_type: 'self', language_id: '' })}
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

              <Field.Text name={`variants.${index}.text`} label="متن سوال" multiline rows={3} />
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