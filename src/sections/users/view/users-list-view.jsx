'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { normalizePhone } from 'src/utils/format-number';

import { useGetUsers } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const ROLE_LABELS = {
  admin: { label: 'ادمین', color: 'error' },
  owner: { label: 'مالک', color: 'warning' },
  user: { label: 'کاربر', color: 'default' },
};

// ----------------------------------------------------------------------

export function UsersListView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetUsers({
    page: page + 1,
    limit: rowsPerPage,
    search: search || undefined,
  });

  const { data: users } = data || {};
  const total = data?.total || 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        مدیریت کاربران
      </Typography>

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="جستجو بر اساس نام یا شماره موبایل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:magnify" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>شناسه</TableCell>
                  <TableCell>نام</TableCell>
                  <TableCell>شماره موبایل</TableCell>
                  <TableCell>نقش</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>تاریخ ثبت‌نام</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">کاربری یافت نشد</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`
                          : '-'}
                      </TableCell>
                      <TableCell dir="ltr">{normalizePhone(user.phone)}</TableCell>
                      <TableCell>
                        <Chip
                          label={ROLE_LABELS[user.role]?.label || user.role}
                          color={ROLE_LABELS[user.role]?.color || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? 'فعال' : 'غیرفعال'}
                          color={user.is_active ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('fa-IR')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="تعداد در صفحه:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`
          }
        />
      </Card>
    </Box>
  );
}
