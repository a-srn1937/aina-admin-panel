'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetTags, useDeleteTag, useGetTagCategories } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TagForm } from '../components';

// ----------------------------------------------------------------------

export function TagsListView() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: categoriesData } = useGetTagCategories();
  const categories = categoriesData?.data || [];

  const { data, isLoading } = useGetTags(
    categoryFilter ? { category_id: categoryFilter } : {}
  );
  const tags = data?.data || [];

  const { mutateAsync: deleteTag } = useDeleteTag();

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این تگ اطمینان دارید؟ تمام ارتباطات با کاربران و آزمون‌ها حذف خواهد شد.')) return;

    try {
      await deleteTag(id);
      toast.success('تگ با موفقیت حذف شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف تگ');
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">مدیریت تگ‌ها</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => setOpenCreate(true)}
          >
            ایجاد تگ
          </Button>
        </Stack>

        <Card sx={{ mb: 3, p: 2 }}>
          <TextField
            select
            fullWidth
            label="فیلتر بر اساس دسته‌بندی"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">همه دسته‌بندی‌ها</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Card>

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
                      <TableCell>دسته‌بندی</TableCell>
                      <TableCell>توضیحات</TableCell>
                      <TableCell align="left">عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tags.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            هیچ تگی یافت نشد
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tags.map((tag) => (
                        <TableRow key={tag.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{tag.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{tag.category?.name || '-'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {tag.description || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setEditingTag(tag)}
                              >
                                <Iconify icon="mdi:pencil" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(tag.id)}
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
        <DialogTitle>ایجاد تگ جدید</DialogTitle>
        <DialogContent>
          <TagForm onSuccess={() => setOpenCreate(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingTag} onClose={() => setEditingTag(null)} maxWidth="sm" fullWidth>
        <DialogTitle>ویرایش تگ</DialogTitle>
        <DialogContent>
          <TagForm tag={editingTag} onSuccess={() => setEditingTag(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
