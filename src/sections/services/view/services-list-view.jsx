'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetServices, useDeleteService } from 'src/api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ServiceEditForm, ServiceCreateForm } from '../components';

// ----------------------------------------------------------------------

export function ServicesListView() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const { data, isLoading } = useGetServices();
  const services = data?.data || [];

  const { mutateAsync: deleteService } = useDeleteService();

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این سرویس اطمینان دارید؟')) return;

    try {
      await deleteService(id);
      toast.success('سرویس با موفقیت حذف شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف سرویس');
    }
  };

  const formatPrice = (amount, currency) => {
    const formatted = new Intl.NumberFormat('fa-IR').format(amount);
    return `${formatted} ${currency === 'IRR' ? 'ریال' : currency}`;
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">مدیریت سرویس‌ها</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => setOpenCreate(true)}
          >
            ایجاد سرویس جدید
          </Button>
        </Stack>

        <Card>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>نام سرویس</TableCell>
                      <TableCell>نوع</TableCell>
                      <TableCell>تست مرتبط</TableCell>
                      <TableCell>قیمت</TableCell>
                      <TableCell>مدت اعتبار</TableCell>
                      <TableCell>وضعیت</TableCell>
                      <TableCell align="left">عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            هیچ سرویسی یافت نشد
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      services.map((service) => (
                        <TableRow key={service.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{service.name}</Typography>
                            {service.description && (
                              <Typography variant="caption" color="text.secondary">
                                {service.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{service.type}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {service.test?.variants?.[0]?.title || service.test?.slug || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {formatPrice(service.price, service.currency)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {service.duration_days ? `${service.duration_days} روز` : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Label color={service.is_active ? 'success' : 'error'}>
                              {service.is_active ? 'فعال' : 'غیرفعال'}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setEditingService(service)}
                              >
                                <Iconify icon="mdi:pencil" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(service.id)}
                              >
                                <Iconify icon="mdi:delete" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          )}
        </Card>
      </Box>

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>ایجاد سرویس جدید</DialogTitle>
        <DialogContent>
          <ServiceCreateForm onSuccess={() => setOpenCreate(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingService}
        onClose={() => setEditingService(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ویرایش سرویس</DialogTitle>
        <DialogContent>
          <ServiceEditForm service={editingService} onSuccess={() => setEditingService(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
