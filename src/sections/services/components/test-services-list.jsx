'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useDeleteService, useGetServicesByTest } from 'src/api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { ServiceEditForm } from './service-edit-form';
import { TestServiceCreateForm } from './test-service-create-form';
import {
  getTierColor,
  getTierLabel,
  getServiceTypeLabel,
  isMaxServicesReached,
} from '../utils/service-helpers';

// ----------------------------------------------------------------------

export function TestServicesList({ testId }) {
  const [editingService, setEditingService] = useState(null);
  const [openCreateService, setOpenCreateService] = useState(false);

  const { data, isLoading, refetch } = useGetServicesByTest(testId);
  const services = data?.data || [];

  const { mutateAsync: deleteService } = useDeleteService();

  // بررسی محدودیت سرویس‌ها
  const maxServicesReached = isMaxServicesReached(services.length);
  const existingTiers = services.map((service) => service.tier);

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این سرویس اطمینان دارید؟')) return;

    try {
      await deleteService(id);
      toast.success('سرویس با موفقیت حذف شد');
      refetch(); // بروزرسانی لیست
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف سرویس');
    }
  };

  const formatPrice = (amount, currency) => {
    const formatted = new Intl.NumberFormat('fa-IR').format(amount);
    return `${formatted} ${currency === 'IRR' ? 'ریال' : currency}`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      {/* Header with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">سرویس‌های این آزمون</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => setOpenCreateService(true)}
          disabled={maxServicesReached}
        >
          افزودن سرویس
        </Button>
      </Box>

      {maxServicesReached && (
        <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.lighter', borderRadius: 1 }}>
          <Typography variant="caption" color="warning.dark">
            حداکثر 3 سرویس (برنز، نقره‌ای، طلایی) برای هر آزمون مجاز است.
          </Typography>
        </Box>
      )}

      {services.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          هیچ سرویسی برای این تست تعریف نشده است
        </Typography>
      ) : (
        <Stack spacing={2}>
          {services.map((service) => (
            <Card key={service.id} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle2">{service.name}</Typography>
                    <Label color={service.is_active ? 'success' : 'error'} size="small">
                      {service.is_active ? 'فعال' : 'غیرفعال'}
                    </Label>
                  </Stack>

                  {service.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      {service.description}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
                    <Typography variant="body2" color="text.secondary">
                      نوع: <strong>{getServiceTypeLabel(service.type)}</strong>
                    </Typography>
                    {service.tier && (
                      <Typography variant="body2" color="text.secondary">
                        سطح:{' '}
                        <strong style={{ color: getTierColor(service.tier) }}>
                          {getTierLabel(service.tier)}
                        </strong>
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      قیمت: <strong>{formatPrice(service.price, service.currency)}</strong>
                    </Typography>
                    {service.duration_days && (
                      <Typography variant="body2" color="text.secondary">
                        اعتبار: <strong>{service.duration_days} روز</strong>
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => setEditingService(service)}
                  >
                    <Iconify icon="mdi:pencil" width={18} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(service.id)}>
                    <Iconify icon="mdi:delete" width={18} />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {/* Create Service Dialog */}
      <Dialog
        open={openCreateService}
        onClose={() => setOpenCreateService(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>افزودن سرویس جدید</DialogTitle>
        <DialogContent>
          <TestServiceCreateForm
            testId={testId}
            existingTiers={existingTiers}
            onSuccess={() => {
              setOpenCreateService(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog
        open={!!editingService}
        onClose={() => setEditingService(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ویرایش سرویس</DialogTitle>
        <DialogContent>
          <ServiceEditForm 
            service={editingService} 
            onSuccess={() => {
              setEditingService(null);
              refetch();
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
