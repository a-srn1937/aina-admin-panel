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

import { useCreateOption, useUpdateOption, useGetLanguages } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VARIANT_TYPES = [
  { value: 'self', label: 'خود (Self)' },
  { value: 'other', label: 'دیگری (Other)' },
];

const optionSchema = z.object({
  question_id: z.any(),
  score: z.coerce.number(),
  order: z.coerce.number().min(0),
  is_active: z.boolean(),
  variants: z.array(
    z.object({
      text: z.string().min(1, 'متن گزینه الزامی است'),
      variant_type: z.enum(['self', 'other']),
      language_id: z.coerce.number().min(1, 'زبان الزامی است'),
    })
  ).min(1, 'حداقل یک ترجمه الزامی است'),
});

// ----------------------------------------------------------------------

export function OptionForm({ questionId, option, onSuccess }) {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];

  const { mutateAsync: createOption, isPending: isCreating } = useCreateOption();
  const { mutateAsync: updateOption, isPending: isUpdating } = useUpdateOption();

  const isEdit = !!option;
  const isPending = isCreating || isUpdating;

  const defaultValues = {
    question_id: questionId,
    score: option?.score || 0,
    order: option?.order || 0,
    is_active: option?.is_active ?? true,
    variants: option?.variants?.map((v) => ({
      text: v.text || '',
      variant_type: v.variant_type || 'self',
      language_id: v.language_id || '',
    })) || [{ text: '', variant_type: 'self', language_id: '' }],
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(optionSchema),
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    if (option) {
      reset({
        question_id: questionId,
        score: option.score || 0,
        order: option.order || 0,
        is_active: option.is_active ?? true,
        variants: option.variants?.map((v) => ({
          text: v.text || '',
          variant_type: v.variant_type || 'self',
          language_id: v.language_id || '',
        })) || [{ text: '', variant_type: 'self', language_id: '' }],
      });
    }
  }, [option, questionId, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        question_id: Number(questionId),
        score: Number(data.score),
        order: Number(data.order),
        is_active: data.is_active,
        variants: data.variants.map((v) => ({
          text: v.text,
          variant_type: v.variant_type,
          language_id: Number(v.language_id),
        })),
      };

      if (isEdit) {
        await updateOption({ id: option.id, data: formattedData });
        toast.success('گزینه با موفقیت ویرایش شد');
      } else {
        await createOption(formattedData);
        toast.success('گزینه با موفقیت ایجاد شد');
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'خطا در ویرایش گزینه' : 'خطا در ایجاد گزینه');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
          <Field.Text name="score" label="امتیاز" type="number" />
          <Field.Text name="order" label="ترتیب" type="number" />
          <Field.Switch name="is_active" label="فعال" />
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">متن گزینه (ترجمه‌ها)</Typography>
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
            sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              {fields.length > 1 && (
                <IconButton size="small" onClick={() => remove(index)}>
                  <Iconify icon="mdi:close" />
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
              <Field.Text name={`variants.${index}.text`} label="متن گزینه" />
            </Stack>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" loading={isPending}>
            {isEdit ? 'ویرایش گزینه' : 'ایجاد گزینه'}
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
