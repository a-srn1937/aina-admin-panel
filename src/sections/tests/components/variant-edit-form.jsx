'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import {
  useUpdateTestVariant,
  useUpdateQuestionVariant,
  useUpdateOptionVariant,
} from 'src/api';

// ----------------------------------------------------------------------

export function TestVariantEditForm({ variant, onSuccess, onCancel }) {
  const { mutateAsync: updateVariant, isPending } = useUpdateTestVariant();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: variant?.title || '',
      subtitle: variant?.subtitle || '',
      description: variant?.description || '',
      invitation_text: variant?.invitation_text || '',
      telegram_text: variant?.telegram_text || '',
      start_text: variant?.start_text || '',
      end_text: variant?.end_text || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateVariant({ variantId: variant.id, data });
      toast.success('ترجمه با موفقیت ویرایش شد');
      onSuccess?.();
    } catch (error) {
      toast.error('خطا در ویرایش ترجمه');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 2 }}>
      <Stack spacing={2}>
        <TextField label="عنوان" fullWidth {...register('title')} />
        <TextField label="زیرعنوان" fullWidth {...register('subtitle')} />
        <TextField label="توضیحات" fullWidth multiline rows={3} {...register('description')} />
        <TextField 
          label="متن دعوت" 
          fullWidth 
          multiline 
          rows={3} 
          placeholder="متنی که کاربران هنگام دعوت دوستان می‌بینند"
          helperText="این متن در صفحه دعوت نمایش داده می‌شود"
          {...register('invitation_text')} 
        />
        <TextField 
          label="متن تلگرام" 
          fullWidth 
          multiline 
          rows={3} 
          placeholder="متنی که در تلگرام ارسال می‌شود"
          helperText="این متن برای اشتراک‌گذاری در تلگرام استفاده می‌شود"
          {...register('telegram_text')} 
        />
        <TextField label="متن شروع" fullWidth multiline rows={3} {...register('start_text')} />
        <TextField label="متن پایان" fullWidth multiline rows={3} {...register('end_text')} />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>انصراف</Button>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            ذخیره
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function QuestionVariantEditForm({ variant, onSuccess, onCancel }) {
  const { mutateAsync: updateVariant, isPending } = useUpdateQuestionVariant();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      text: variant?.text || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateVariant({ variantId: variant.id, data });
      toast.success('ترجمه سوال با موفقیت ویرایش شد');
      onSuccess?.();
    } catch (error) {
      toast.error('خطا در ویرایش ترجمه سوال');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 2 }}>
      <Stack spacing={2}>
        <TextField label="متن سوال" fullWidth multiline rows={3} {...register('text')} />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>انصراف</Button>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            ذخیره
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function OptionVariantEditForm({ variant, onSuccess, onCancel }) {
  const { mutateAsync: updateVariant, isPending } = useUpdateOptionVariant();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      text: variant?.text || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateVariant({ variantId: variant.id, data });
      toast.success('ترجمه گزینه با موفقیت ویرایش شد');
      onSuccess?.();
    } catch (error) {
      toast.error('خطا در ویرایش ترجمه گزینه');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 2 }}>
      <Stack spacing={2}>
        <TextField label="متن گزینه" fullWidth {...register('text')} />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>انصراف</Button>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            ذخیره
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
}
