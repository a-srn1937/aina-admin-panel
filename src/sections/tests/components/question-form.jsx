'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useGetLanguages, useCreateQuestion } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VARIANT_TYPES = [
  { value: 'self', label: 'خود (Self)' },
  { value: 'other', label: 'دیگری (Other)' },
];

const questionSchema = z.object({
  test_id: z.any(),
  index_id: z.coerce.number().min(1, 'شاخص الزامی است'),
  order: z.coerce.number().min(0),
  is_active: z.boolean(),
  logic_type: z.string().max(1).regex(/^[A-Z]?$/, 'فقط یک حرف بزرگ انگلیسی (A-Z)').optional(),
  variants: z.array(
    z.object({
      text: z.string().min(1, 'متن سوال الزامی است'),
      variant_type: z.enum(['self', 'other']),
      language_id: z.coerce.number().min(1, 'زبان الزامی است'),
    })
  ).min(1, 'حداقل یک ترجمه الزامی است'),
});

// ----------------------------------------------------------------------

export function QuestionForm({ testId, indexOptions = [], onSuccess }) {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];

  const { mutateAsync: createQuestion, isPending } = useCreateQuestion();

  const defaultValues = {
    test_id: testId,
    index_id: '',
    order: 0,
    is_active: true,
    logic_type: '',
    variants: [{ text: '', variant_type: 'self', language_id: '' }],
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(questionSchema),
  });

  const { control, handleSubmit, reset } = methods;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: 'variants' });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: 'options' });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        test_id: Number(testId),
        index_id: Number(data.index_id),
        order: Number(data.order),
        is_active: data.is_active,
        logic_type: data.logic_type || undefined,
        variants: data.variants.map((v) => ({
          text: v.text,
          variant_type: v.variant_type,
          language_id: Number(v.language_id),
        })),
      };

      const questionRes = await createQuestion(formattedData);
      
      toast.success('سوال با موفقیت ایجاد شد');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ایجاد سوال');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Typography variant="subtitle1">اطلاعات سوال</Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
          <Field.Select name="index_id" label="شاخص" required>
            {indexOptions.map((idx) => (
              <MenuItem key={idx.id} value={idx.id}>
                {idx.name || idx.id}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text name="order" label="ترتیب" type="number" />

          <Field.Text
            name="logic_type"
            label="تایپ منطق"
            placeholder="A-Z"
            inputProps={{ maxLength: 1, style: { textTransform: 'uppercase' } }}
            helperText="یک حرف بزرگ انگلیسی (A-Z)"
          />
        </Box>

        <Field.Switch name="is_active" label="فعال" />

        <Divider />

        {/* Question Variants */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">متن سوال (ترجمه‌ها)</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => appendVariant({ text: '', variant_type: 'self', language_id: '' })}
          >
            افزودن ترجمه
          </Button>
        </Box>

        {variantFields.map((field, index) => (
          <Box
            key={field.id}
            sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              {variantFields.length > 1 && (
                <IconButton size="small" onClick={() => removeVariant(index)}>
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
              <Field.Text name={`variants.${index}.text`} label="متن سوال" multiline rows={2} />
            </Stack>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ایجاد سوال
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
