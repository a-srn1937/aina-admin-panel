'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import DialogContent from '@mui/material/DialogContent';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetTests } from 'src/api';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { TestCreateForm } from '../components/test-create-form';

// ----------------------------------------------------------------------

export function TestsListView() {
  const [openCreate, setOpenCreate] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const router = useRouter();

  const { data, isLoading, refetch } = useGetTests();

  const { data: tests = [] } = data || {};

  const handleCloseCreate = () => {
    setOpenCreate(false);
    refetch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">مدیریت آزمون‌ها</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="list">
              <Iconify icon="mdi:format-list-bulleted" width={20} />
            </ToggleButton>
            <ToggleButton value="grid">
              <Iconify icon="mdi:view-grid" width={20} />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => setOpenCreate(true)}
          >
            افزودن آزمون
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : tests.length === 0 ? (
        <Card sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">آزمونی یافت نشد</Typography>
        </Card>
      ) : viewMode === 'list' ? (
          <Stack spacing={2}>
            {tests.map((test) => (
              <Card key={test.id}>
                <CardActionArea
                  onClick={() => router.push(paths.dashboard.test.details(test.id))}
                  sx={{ display: 'flex', alignItems: 'stretch' }}
                >
                  <Box
                    sx={{
                      width: 120,
                      minHeight: 100,
                      bgcolor: 'background.neutral',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {test.image_file?.filename || test.image ? (
                      <Box
                        component="img"
                        src={
                          test.image_file?.filename
                            ? `${CONFIG.assetsDir}/uploads/${test.image_file.filename}`
                            : test.image
                        }
                        alt={test.slug}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Iconify
                        icon="mdi:clipboard-text-outline"
                        width={40}
                        sx={{ color: 'text.disabled' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                        {test.variants?.[0]?.title || test.slug}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 500 }}>
                        {test.variants?.[0]?.description || '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
                      <Chip
                        label={test.is_active ? 'فعال' : 'غیرفعال'}
                        color={test.is_active ? 'success' : 'default'}
                        size="small"
                      />
                      {test.min_participants > 0 && (
                        <Chip
                          label={`${test.min_participants}-${test.max_participants} نفره`}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      )}
                      <Iconify icon="mdi:chevron-left" width={24} sx={{ color: 'text.secondary' }} />
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2}>
            {tests.map((test) => (
              <Grid item xs={12} sm={6} md={3} key={test.id}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea
                    onClick={() => router.push(paths.dashboard.test.details(test.id))}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <Box
                      sx={{
                        height: 160,
                        bgcolor: 'background.neutral',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {test.image_file?.filename || test.image ? (
                        <Box
                          component="img"
                          src={
                            test.image_file?.filename
                              ? `${CONFIG.assetsDir}/uploads/${test.image_file.filename}`
                              : test.image
                          }
                          alt={test.slug}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Iconify
                          icon="mdi:clipboard-text-outline"
                          width={60}
                          sx={{ color: 'text.disabled' }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                        {test.variants?.[0]?.title || test.slug}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {test.variants?.[0]?.description || '-'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={test.is_active ? 'فعال' : 'غیرفعال'}
                          color={test.is_active ? 'success' : 'default'}
                          size="small"
                        />
                        {test.min_participants > 0 && (
                          <Chip
                            label={`${test.min_participants}-${test.max_participants} نفره`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

      {/* Create Test Dialog */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="md" fullWidth>
        <DialogTitle>افزودن آزمون جدید</DialogTitle>
        <DialogContent>
          <TestCreateForm onSuccess={handleCloseCreate} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
