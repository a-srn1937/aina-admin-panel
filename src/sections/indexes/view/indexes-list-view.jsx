'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
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

import { useGetIndexes, useDeleteIndex } from 'src/api';

import { Iconify } from 'src/components/iconify';

import { IndexForm } from '../components/index-form';

// ----------------------------------------------------------------------

export function IndexesListView() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const { data, isLoading, refetch } = useGetIndexes();
  const { mutateAsync: deleteIndex } = useDeleteIndex();

  const indexes = data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این شاخص اطمینان دارید؟')) return;
    try {
      await deleteIndex(id);
      toast.success('شاخص حذف شد');
      refetch();
    } catch (error) {
      // Error is handled by axios interceptor
    }
  };

  const handleCloseForm = () => {
    setOpenCreate(false);
    setEditingIndex(null);
    refetch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">مدیریت شاخص‌ها</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => setOpenCreate(true)}
        >
          افزودن شاخص
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : indexes.length === 0 ? (
        <Card sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">شاخصی یافت نشد</Typography>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>شناسه</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>نام</TableCell>
                  <TableCell>توضیحات</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell align="left">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {indexes.map((index) => (
                  <TableRow key={index.id}>
                    <TableCell>{index.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {index.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>{index.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                        {index.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={index.is_active ? 'فعال' : 'غیرفعال'}
                        size="small"
                        color={index.is_active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <IconButton size="small" color="primary" onClick={() => setEditingIndex(index)}>
                        <Iconify icon="mdi:pencil" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(index.id)}>
                        <Iconify icon="mdi:delete" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openCreate || !!editingIndex} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIndex ? 'ویرایش شاخص' : 'افزودن شاخص جدید'}</DialogTitle>
        <DialogContent>
          <IndexForm index={editingIndex} onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
