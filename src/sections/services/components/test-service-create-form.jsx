'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useCreateService } from 'src/api';

import { Form, Field } from 'src/components/hook-form';

import { SERVICE_TYPES, TIER_TYPES, getAvailableTiers } from '../utils/service-helpers';

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
});

// ----------------------------------------------------------------------

export function TestServiceCreateForm({ testId, existingTiers = [], onSuccess }) {
  const { mutateAsync: createService, isPending } = useCreateService();

  const availableTiers = getAvailableTiers(existingTiers);

  const defaultValues = {
    name: '',
    description: '',
    type: 'ai_report_card',
    tier: availableTiers[0]?.value || 'BRONZE',
    price: 0,
    currency: 'IRR',
    is_active: true,
    duration_days: 365,
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(serviceSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        price: Number(data.price),
        duration_days: data.duration_days ? Number(data.duration_days) : null,
        test_id: Number(testId),
      };

      await createService(formattedData);
      toast.success('سرویس با موفقیت ایجاد شد');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ایجاد سرویس');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        <Typography variant="subtitle1">ایجاد سرویس جدید برای این آزمون</Typography>

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
            {availableTiers.length > 0 ? (
              availableTiers.map((tier) => (
                <MenuItem key={tier.value} value={tier.value}>
                  {tier.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>همه سطوح تعریف شده</MenuItem>
            )}
          </Field.Select>
        </Box>

        {availableTiers.length === 0 && (
          <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="error.dark">
              همه سطوح سرویس (برنز، نقره‌ای، طلایی) برای این آزمون تعریف شده‌اند.
            </Typography>
          </Box>
        )}

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
          <Button type="submit" variant="contained" loading={isPending} disabled={availableTiers.length === 0}>
            ایجاد سرویس
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
