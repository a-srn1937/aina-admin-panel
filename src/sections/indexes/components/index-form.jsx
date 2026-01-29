'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useCreateIndex, useUpdateIndex } from 'src/api';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const indexSchema = z.object({
  slug: z.string().min(1, 'شناسه یکتا الزامی است'),
  name: z.string().min(1, 'نام الزامی است'),
  description: z.string().optional(),
  is_active: z.boolean(),
});

// ----------------------------------------------------------------------

export function IndexForm({ index, onSuccess }) {
  const { mutateAsync: createIndex, isPending: isCreating } = useCreateIndex();
  const { mutateAsync: updateIndex, isPending: isUpdating } = useUpdateIndex();

  const isEdit = !!index;
  const isPending = isCreating || isUpdating;

  const defaultValues = {
    slug: '',
    name: '',
    description: '',
    is_active: true,
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(indexSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (index) {
      reset({
        slug: index.slug || '',
        name: index.name || '',
        description: index.description || '',
        is_active: index.is_active ?? true,
      });
    }
  }, [index, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateIndex({ id: index.id, data });
        toast.success('شاخص با موفقیت ویرایش شد');
      } else {
        await createIndex(data);
        toast.success('شاخص با موفقیت ایجاد شد');
      }
      onSuccess?.();
    } catch (error) {
      // Error handled by axios interceptor
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ pt: 2 }}>
        <Field.Text name="slug" label="شناسه یکتا (slug)" required />
        <Field.Text name="name" label="نام" required />
        <Field.Text name="description" label="توضیحات" multiline rows={3} />
        <Field.Switch name="is_active" label="فعال" />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ایجاد شاخص'}
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
