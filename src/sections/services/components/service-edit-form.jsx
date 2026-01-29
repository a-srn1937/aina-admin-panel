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
import Typography from '@mui/material/Typography';

import { useGetTests, useUpdateService } from 'src/api';

import { Form, Field } from 'src/components/hook-form';

import { TIER_TYPES, SERVICE_TYPES } from '../utils/service-helpers';

// ----------------------------------------------------------------------

const CURRENCIES = [
  { value: 'IRR', label: 'ریال' },
  { value: 'USD', label: 'دلار' },
];

const serviceSchema = z.object({
  name: z.string().min(1, 'نام سرویس الزامی است'),
  description: z.string().optional(),
  type: z.string().min(1, 'نوع سرویس الزامی است'),
  tier: z.string().min(1, 'سطح سرویس الزامی است'),
  price: z.coerce.number().min(0, 'قیمت باید عدد مثبت باشد'),
  currency: z.string().default('IRR'),
  is_active: z.boolean().default(true),
  duration_days: z.coerce.number().min(0, 'مدت اعتبار باید عدد مثبت باشد').optional(),
  test_id: z.coerce.number().min(1, 'انتخاب تست الزامی است'),
});

// ----------------------------------------------------------------------

export function ServiceEditForm({ service, onSuccess }) {
  const { data: testsData } = useGetTests();
  const tests = testsData?.data || [];

  const { mutateAsync: updateService, isPending } = useUpdateService();

  const defaultValues = {
    name: service?.name || '',
    description: service?.description || '',
    type: service?.type || 'ai_report_card',
    tier: service?.tier || 'BRONZE',
    price: parseInt(service?.price, 10) || 0,
    currency: service?.currency || 'IRR',
    is_active: service?.is_active ?? true,
    duration_days: service?.duration_days || 365,
    test_id: service?.test_id || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(serviceSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (service) {
      reset({
        name: service.name || '',
        description: service.description || '',
        type: service.type || 'ai_report_card',
        tier: service.tier || 'BRONZE',
        price: parseInt(service.price, 10) || 0,
        currency: service.currency || 'IRR',
        is_active: service.is_active ?? true,
        duration_days: service.duration_days || 365,
        test_id: service.test_id || '',
      });
    }
  }, [service, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        price: Number(data.price),
        duration_days: data.duration_days ? Number(data.duration_days) : null,
        test_id: Number(data.test_id),
      };

      await updateService({ id: service.id, data: formattedData });
      toast.success('سرویس با موفقیت ویرایش شد');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ویرایش سرویس');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Typography variant="subtitle1">اطلاعات سرویس</Typography>

        <Field.Text name="name" label="نام سرویس" required />

        <Field.Text name="description" label="توضیحات" multiline rows={3} />

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Field.Select name="type" label="نوع سرویس" required>
            {SERVICE_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select name="tier" label="سطح سرویس" required>
            {TIER_TYPES.map((tier) => (
              <MenuItem key={tier.value} value={tier.value}>
                {tier.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Field.Select name="test_id" label="تست مرتبط" required>
          {tests.map((test) => (
            <MenuItem key={test.id} value={test.id}>
              {test.variants?.[0]?.title || test.slug}
            </MenuItem>
          ))}
        </Field.Select>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
          <Field.Text name="price" label="قیمت" type="number" required />

          <Field.Select name="currency" label="واحد پول">
            {CURRENCIES.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Field.Text
          name="duration_days"
          label="مدت اعتبار (روز)"
          type="number"
          helperText="تعداد روزهایی که سرویس معتبر است"
        />

        <Field.Switch name="is_active" label="فعال" />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button type="submit" variant="contained" loading={isPending}>
            ذخیره تغییرات
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
