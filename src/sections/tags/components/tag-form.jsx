'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { useCreateTag, useUpdateTag, useGetTagCategories } from 'src/api';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const tagSchema = z.object({
  name: z.string().min(1, 'نام الزامی است'),
  category_id: z.coerce.number().min(1, 'دسته‌بندی الزامی است'),
  description: z.string().optional(),
});

// ----------------------------------------------------------------------

export function TagForm({ tag, onSuccess }) {
  const isEdit = !!tag;

  const { data: categoriesData } = useGetTagCategories();
  const categories = categoriesData?.data || [];

  const { mutateAsync: createTag, isPending: isCreating } = useCreateTag();
  const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();

  const defaultValues = {
    name: tag?.name || '',
    category_id: tag?.category_id || '',
    description: tag?.description || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(tagSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        category_id: Number(data.category_id),
      };

      if (isEdit) {
        await updateTag({ id: tag.id, data: formattedData });
        toast.success('تگ با موفقیت ویرایش شد');
      } else {
        await createTag(formattedData);
        toast.success('تگ با موفقیت ایجاد شد');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'خطا در ویرایش تگ' : 'خطا در ایجاد تگ');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Field.Text name="name" label="نام تگ" required />

        <Field.Select name="category_id" label="دسته‌بندی" required>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text name="description" label="توضیحات" multiline rows={3} />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button type="submit" variant="contained" loading={isCreating || isUpdating}>
            {isEdit ? 'ذخیره تغییرات' : 'ایجاد تگ'}
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
