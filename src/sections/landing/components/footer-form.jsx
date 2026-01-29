'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetFooter, useUpdateFooter, useGetLanguages } from 'src/api';

import { Form, Field } from 'src/components/hook-form';

const footerSchema = z.object({
  disclaimer: z.string().optional(),
  language_id: z.coerce.number().min(1, 'زبان الزامی است'),
});

export function FooterForm() {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];
  const { data: footerData, isLoading } = useGetFooter();
  const { mutateAsync: updateFooter, isPending } = useUpdateFooter();

  const methods = useForm({
    defaultValues: {
      disclaimer: '',
      language_id: '',
    },
    resolver: zodResolver(footerSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (footerData?.data) {
      const footer = footerData.data;
      reset({
        disclaimer: footer.disclaimer || '',
        language_id: footer.language_id || '',
      });
    }
  }, [footerData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateFooter(data);
      toast.success('Footer با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره');
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Field.Text name="disclaimer" label="دیسکلیمر" multiline rows={4} />

        <Field.Select name="language_id" label="زبان" required>
          {languages.map((lang) => (
            <MenuItem key={lang.id} value={lang.id}>
              {lang.name}
            </MenuItem>
          ))}
        </Field.Select>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ذخیره تغییرات
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
