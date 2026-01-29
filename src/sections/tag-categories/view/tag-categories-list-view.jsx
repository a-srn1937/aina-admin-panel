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

import { useGetTagCategories, useDeleteTagCategory } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TagCategoryForm } from '../components';

// ----------------------------------------------------------------------

export function TagCategoriesListView() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data, isLoading } = useGetTagCategories();
  const categories = data?.data || [];

  const { mutateAsync: deleteCategory } = useDeleteTagCategory();

  const handleDelete = async (id, tagsCount) => {
    if (tagsCount > 0) {
      toast.error('نمی‌توانید دسته‌بندی با تگ حذف کنید');
      return;
    }

    if (!window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) return;

    try {
      await deleteCategory(id);
      toast.success('دسته‌بندی با موفقیت حذف شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف دسته‌بندی');
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">دسته‌بندی تگ‌ها</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => setOpenCreate(true)}
          >
            ایجاد دسته‌بندی
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
                      <TableCell>نام</TableCell>
                      <TableCell>توضیحات</TableCell>
                      <TableCell>تعداد تگ</TableCell>
                      <TableCell align="left">عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            هیچ دسته‌بندی یافت نشد
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{category.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {category.description || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {category.tags?.length || 0} تگ
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Iconify icon="mdi:pencil" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(category.id, category.tags?.length || 0)}
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
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ایجاد دسته‌بندی جدید</DialogTitle>
        <DialogContent>
          <TagCategoryForm onSuccess={() => setOpenCreate(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
        <DialogContent>
          <TagCategoryForm
            category={editingCategory}
            onSuccess={() => setEditingCategory(null)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
