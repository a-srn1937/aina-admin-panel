'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPayments } from 'src/api';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: '', label: 'همه' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'completed', label: 'موفق' },
  { value: 'failed', label: 'ناموفق' },
  { value: 'refunded', label: 'بازگشت داده شده' },
];

const STATUS_COLORS = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
  refunded: 'info',
};

const STATUS_LABELS = {
  pending: 'در انتظار',
  completed: 'موفق',
  failed: 'ناموفق',
  refunded: 'بازگشت',
};

// ----------------------------------------------------------------------

export function PaymentsListView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useGetPayments({
    page: page + 1,
    limit: rowsPerPage,
    status: status || undefined,
  });

  const payments = data?.data || [];
  const total = data?.total || 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPrice = (amount) => new Intl.NumberFormat('fa-IR').format(amount);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        مدیریت پرداخت‌ها
      </Typography>

      <Card>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="وضعیت"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 1000 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>شناسه</TableCell>
                  <TableCell>کاربر</TableCell>
                  <TableCell>خدمت</TableCell>
                  <TableCell>مبلغ</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>کد پیگیری</TableCell>
                  <TableCell>تاریخ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">پرداختی یافت نشد</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {payment.user?.first_name || ''} {payment.user?.last_name || ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" dir="ltr">
                            {payment.user?.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{payment.service?.name || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatPrice(payment.amount)} {payment.currency === 'IRR' ? 'ریال' : payment.currency}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={STATUS_LABELS[payment.status] || payment.status}
                          color={STATUS_COLORS[payment.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell dir="ltr">
                        {payment.zarinpal_ref_id || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString('fa-IR')}
                      </TableCell>
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
