'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetFeedbacks, useGetFeedbackById, useReplyFeedback, useResolveFeedback } from 'src/api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: '', label: 'همه', color: 'default' },
  { value: 'pending', label: 'در انتظار', color: 'warning' },
  { value: 'replied', label: 'پاسخ داده شده', color: 'info' },
  { value: 'resolved', label: 'حل شده', color: 'success' },
];

// ----------------------------------------------------------------------

export function FeedbackListView() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading } = useGetFeedbacks({
    status: status || undefined,
    page: page + 1,
    limit: rowsPerPage,
  });

  const feedbacks = Array.isArray(data?.data?.data) ? data.data.data : [];
  const total = data?.data?.total || feedbacks.length;

  const { data: feedbackDetail, isLoading: isLoadingDetail } = useGetFeedbackById(selectedId);
  const { mutateAsync: replyFeedback, isPending: isReplying } = useReplyFeedback();
  const { mutateAsync: resolveFeedback, isPending: isResolving } = useResolveFeedback();

  const handleStatusChange = (_, newValue) => {
    setStatus(newValue);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('متن پاسخ را وارد کنید');
      return;
    }
    try {
      await replyFeedback({ id: selectedId, reply: replyText });
      toast.success('پاسخ با موفقیت ارسال شد');
      setReplyText('');
    } catch (error) {
      toast.error('خطا در ارسال پاسخ');
    }
  };

  const handleResolve = async () => {
    try {
      await resolveFeedback(selectedId);
      toast.success('تیکت به عنوان حل شده علامت‌گذاری شد');
    } catch (error) {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleCloseDialog = () => {
    setSelectedId(null);
    setReplyText('');
  };

  const getStatusColor = (s) => {
    const option = STATUS_OPTIONS.find((o) => o.value === s);
    return option?.color || 'default';
  };

  const getStatusLabel = (s) => {
    const option = STATUS_OPTIONS.find((o) => o.value === s);
    return option?.label || s;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const detail = feedbackDetail?.data?.data || feedbackDetail?.data;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              پیام‌های کاربران
            </Typography>
            <Typography variant="body2" color="text.secondary">
              مدیریت و پاسخ به پیام‌های دریافتی
            </Typography>
          </Box>
        </Stack>

        <Card>
          <Tabs
            value={status}
            onChange={handleStatusChange}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((option) => (
              <Tab key={option.value} value={option.value} label={option.label} />
            ))}
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>کاربر</TableCell>
                        <TableCell>پیام</TableCell>
                        <TableCell>تاریخ</TableCell>
                        <TableCell>وضعیت</TableCell>
                        <TableCell align="left">عملیات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feedbacks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Box sx={{ py: 5 }}>
                              <Iconify
                                icon="solar:inbox-line-linear"
                                width={48}
                                sx={{ color: 'text.disabled', mb: 2 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                پیامی یافت نشد
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        feedbacks.map((feedback) => (
                          <TableRow
                            key={feedback.id}
                            hover
                            sx={{
                              cursor: 'pointer',
                              bgcolor: feedback.status === 'pending' ? 'action.hover' : 'inherit',
                            }}
                            onClick={() => setSelectedId(feedback.id)}
                          >
                            <TableCell>
                              <Typography variant="subtitle2">
                                {feedback.user_name || feedback.user?.name || '-'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {feedback.user_phone || feedback.user?.phone || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                {feedback.message?.substring(0, 80)}
                                {feedback.message?.length > 80 ? '...' : ''}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {formatDate(feedback.created_at)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Label color={getStatusColor(feedback.status)}>
                                {getStatusLabel(feedback.status)}
                              </Label>
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(feedback.id);
                                }}
                              >
                                مشاهده
                              </Button>
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
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="تعداد در صفحه:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
              />
            </>
          )}
        </Card>
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedId}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:letter-bold" width={24} />
              <span>جزئیات پیام</span>
            </Stack>
            {detail && (
              <Label color={getStatusColor(detail.status)}>
                {getStatusLabel(detail.status)}
              </Label>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {isLoadingDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : detail ? (
            <Stack spacing={2.5}>
              {/* Sender Info */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  فرستنده
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {detail.user_name || detail.user?.name || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.user_phone || detail.user?.phone || '-'}
                </Typography>
              </Box>

              {/* Message */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  پیام کاربر
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    mt: 0.5,
                    borderRadius: 1,
                    bgcolor: 'warning.lighter',
                    border: '1px solid',
                    borderColor: 'warning.light',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <Typography variant="body2">{detail.message}</Typography>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                  {formatDate(detail.created_at)}
                </Typography>
              </Box>

              {/* Admin Reply (if exists) */}
              {detail.admin_reply && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    پاسخ ادمین
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      mt: 0.5,
                      borderRadius: 1,
                      bgcolor: 'success.lighter',
                      border: '1px solid',
                      borderColor: 'success.light',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <Typography variant="body2">{detail.admin_reply}</Typography>
                  </Box>
                  {detail.replied_at && (
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      {formatDate(detail.replied_at)}
                    </Typography>
                  )}
                </Box>
              )}

              <Divider />

              {/* Reply Form */}
              {detail.status !== 'resolved' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {detail.admin_reply ? 'ویرایش پاسخ' : 'ارسال پاسخ'}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="متن پاسخ خود را بنویسید..."
                    sx={{ mb: 2 }}
                  />
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={handleResolve}
                      disabled={isResolving}
                      startIcon={<Iconify icon="solar:check-circle-bold" />}
                    >
                      حل شده
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleReply}
                      disabled={isReplying || !replyText.trim()}
                      startIcon={
                        isReplying ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <Iconify icon="solar:plain-bold" />
                        )
                      }
                    >
                      ارسال پاسخ
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
