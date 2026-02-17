'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, normalizePhone } from 'src/utils/format-number';

import { useGetRatings, useGetRatingStats } from 'src/api/rating';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function RatingsListView() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [minScore, setMinScore] = useState('');
  const [hasComment, setHasComment] = useState('');

  const { data: statsData, isLoading: isLoadingStats } = useGetRatingStats();

  const { data, isLoading } = useGetRatings({
    page: page + 1,
    limit: rowsPerPage,
    min_score: minScore || undefined,
    has_comment: hasComment === '' ? undefined : hasComment === 'true',
  });

  const ratings = Array.isArray(data?.data) ? data.data : [];
  const total = data?.data?.total || 0;
  const stats = statsData;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            امتیازها و نظرات
          </Typography>
          <Typography variant="body2" color="text.secondary">
            مشاهده امتیازها و نظرات کاربران
          </Typography>
        </Box>
      </Stack>

      {/* Stats Cards */}
      {isLoadingStats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, mb: 3 }}>
          <CircularProgress />
        </Box>
      ) : stats ? (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
            {/* Total Ratings Card */}
            <Card
              sx={{
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.dark, 0.2)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: alpha(theme.palette.warning.main, 0.12),
                }}
              />
              <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.warning.main, 0.16),
                    color: 'warning.main',
                  }}
                >
                  <Iconify icon="solar:star-bold" width={32} />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h3">{fNumber(stats.total_ratings || 0)}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    تعداد کل امتیازها
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Average Score Card */}
            <Card
              sx={{
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.dark, 0.2)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: alpha(theme.palette.success.main, 0.12),
                }}
              />
              <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.16),
                    color: 'success.main',
                  }}
                >
                  <Iconify icon="solar:chart-bold" width={32} />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h3">{stats.average_score?.toFixed(1) || 0}</Typography>
                    <Rating value={stats.average_score || 0} readOnly precision={0.1} size="small" />
                  </Stack>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    میانگین امتیاز
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Ratings with Comments Card */}
            <Card
              sx={{
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.2)} 0%, ${alpha(theme.palette.info.dark, 0.2)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: alpha(theme.palette.info.main, 0.12),
                }}
              />
              <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.info.main, 0.16),
                    color: 'info.main',
                  }}
                >
                  <Iconify icon="solar:chat-round-bold" width={32} />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h3">{fNumber(stats.ratings_with_comments || 0)}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    امتیازهای دارای نظر
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Score Distribution Card */}
            <Card
              sx={{
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: alpha(theme.palette.primary.main, 0.12),
                }}
              />
              <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.16),
                    color: 'primary.main',
                  }}
                >
                  <Iconify icon="solar:pie-chart-bold" width={32} />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                    توزیع امتیازها
                  </Typography>
                  <Stack spacing={1}>
                    {[5, 4, 3, 2, 1].map((score) => {
                      const item = stats.score_distribution?.find((d) => d.score === score);
                      const count = item?.count || 0;
                      const percentage = stats.total_ratings > 0 ? (count / stats.total_ratings) * 100 : 0;
                      return (
                        <Stack key={score} direction="row" alignItems="center" spacing={1}>
                          <Rating value={1} readOnly size="small" max={1} />
                          <Typography variant="caption" sx={{ minWidth: 12 }}>
                            {score}
                          </Typography>
                          <Box
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.16),
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: '100%',
                                bgcolor: 'primary.main',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24, textAlign: 'right' }}>
                            {count}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Box>
      ) : null}

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={minScore}
              onChange={(e) => {
                setMinScore(e.target.value);
                setPage(0);
              }}
              displayEmpty
            >
              <MenuItem value="">همه امتیازها</MenuItem>
              <MenuItem value="5">5 ستاره</MenuItem>
              <MenuItem value="4">4+ ستاره</MenuItem>
              <MenuItem value="3">3+ ستاره</MenuItem>
              <MenuItem value="2">2+ ستاره</MenuItem>
              <MenuItem value="1">1+ ستاره</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={hasComment}
              onChange={(e) => {
                setHasComment(e.target.value);
                setPage(0);
              }}
              displayEmpty
            >
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="true">فقط با نظر</MenuItem>
              <MenuItem value="false">بدون نظر</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Ratings Table */}
      <Card>
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
                      <TableCell>آزمون</TableCell>
                      <TableCell>امتیاز</TableCell>
                      <TableCell>نظر</TableCell>
                      <TableCell>تاریخ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ratings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box sx={{ py: 5 }}>
                            <Iconify
                              icon="solar:inbox-line-linear"
                              width={48}
                              sx={{ color: 'text.disabled', mb: 2 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              امتیازی یافت نشد
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ratings.map((rating) => (
                        <TableRow key={rating.id} hover>
                          <TableCell>
                            {rating.user ? (
                              <>
                                <Typography variant="subtitle2">
                                  {rating.user.first_name} {rating.user.last_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {normalizePhone(rating.user.phone)}
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {rating.context || rating.test?.slug || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Rating value={rating.score} readOnly size="small" />
                          </TableCell>
                          <TableCell>
                            {rating.comment ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 300,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {rating.comment}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {formatDate(rating.created_at)}
                            </Typography>
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
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="تعداد در صفحه:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
            />
          </>
        )}
      </Card>
    </Box>
  );
}
