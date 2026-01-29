'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useCreateTagCategory, useUpdateTagCategory } from 'src/api';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const tagCategorySchema = z.object({
  name: z.string().min(1, 'نام الزامی است'),
  description: z.string().optional(),
});

// ----------------------------------------------------------------------

export function TagCategoryForm({ category, onSuccess }) {
  const isEdit = !!category;

  const { mutateAsync: createCategory, isPending: isCreating } = useCreateTagCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateTagCategory();

  const defaultValues = {
    name: category?.name || '',
    description: category?.description || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(tagCategorySchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateCategory({ id: category.id, data });
        toast.success('دسته‌بندی با موفقیت ویرایش شد');
      } else {
        await createCategory(data);
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'خطا در ویرایش دسته‌بندی' : 'خطا در ایجاد دسته‌بندی');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Field.Text name="name" label="نام دسته‌بندی" required />
        <Field.Text name="description" label="توضیحات" multiline rows={3} />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button type="submit" variant="contained" loading={isCreating || isUpdating}>
            {isEdit ? 'ذخیره تغییرات' : 'ایجاد دسته‌بندی'}
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
