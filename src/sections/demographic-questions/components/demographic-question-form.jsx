'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useGetTags, useCreateDemographicQuestion, useUpdateDemographicQuestion } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const questionSchema = z.object({
  text: z.string().min(1, 'متن سوال الزامی است'),
  display_order: z.coerce.number().min(0),
  is_active: z.boolean(),
  show_on_onboarding: z.boolean(),
  options: z
    .array(
      z.object({
        text: z.string().min(1, 'متن گزینه الزامی است'),
        tag_id: z.coerce.number().min(1, 'تگ الزامی است'),
        display_order: z.coerce.number().min(0),
      })
    )
    .min(2, 'حداقل 2 گزینه الزامی است'),
});

// ----------------------------------------------------------------------

export function DemographicQuestionForm({ question, onSuccess }) {
  const isEdit = !!question;

  const { data: tagsData } = useGetTags();
  const tags = tagsData?.data || [];

  const { mutateAsync: createQuestion, isPending: isCreating } = useCreateDemographicQuestion();
  const { mutateAsync: updateQuestion, isPending: isUpdating } = useUpdateDemographicQuestion();

  const defaultValues = {
    text: question?.text || '',
    display_order: question?.display_order || 0,
    is_active: question?.is_active ?? true,
    show_on_onboarding: question?.show_on_onboarding ?? false,
    options: question?.options || [
      { text: '', tag_id: '', display_order: 0 },
      { text: '', tag_id: '', display_order: 1 },
    ],
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(questionSchema),
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        display_order: Number(data.display_order),
        options: data.options.map((opt, idx) => ({
          text: opt.text,
          tag_id: Number(opt.tag_id),
          display_order: idx,
        })),
      };

      if (isEdit) {
        await updateQuestion({ id: question.id, data: formattedData });
        toast.success('سوال با موفقیت ویرایش شد');
      } else {
        await createQuestion(formattedData);
        toast.success('سوال با موفقیت ایجاد شد');
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'خطا در ویرایش سوال' : 'خطا در ایجاد سوال');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            اطلاعات سوال
          </Typography>

          <Stack spacing={3}>
            <Field.Text name="text" label="متن سوال" required multiline rows={2} />

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <Field.Text name="display_order" label="ترتیب نمایش" type="number" />
              <Box />
            </Box>

            <Stack direction="row" spacing={3}>
              <Field.Switch name="is_active" label="فعال" />
              <Field.Switch name="show_on_onboarding" label="نمایش در onboarding" />
            </Stack>
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">گزینه‌ها</Typography>
            <Button
              size="small"
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={() =>
                append({ text: '', tag_id: '', display_order: fields.length })
              }
            >
              افزودن گزینه
            </Button>
          </Box>

          <Stack spacing={2}>
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
                {fields.length > 2 && (
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  >
                    <Iconify icon="mdi:close" />
                  </IconButton>
                )}

                <Stack spacing={2}>
                  <Typography variant="caption" color="text.secondary">
                    گزینه {index + 1}
                  </Typography>

                  <Field.Text
                    name={`options.${index}.text`}
                    label="متن گزینه"
                    required
                  />

                  <Field.Select name={`options.${index}.tag_id`} label="تگ مرتبط" required>
                    {tags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name} ({tag.category?.name})
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Card>

        <Divider />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button type="submit" variant="contained" size="large" loading={isCreating || isUpdating}>
            {isEdit ? 'ذخیره تغییرات' : 'ایجاد سوال'}
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
