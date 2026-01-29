'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetSiteContents, useUpdateSiteContent } from 'src/api';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const CONTENT_FIELDS = [
  {
    key: 'dashboard_header',
    label: 'متن اصلی بالای صفحه',
    description: 'این متن در بالای صفحه اصلی داشبورد نمایش داده می‌شود',
    placeholder: 'متن هدر اصلی داشبورد را وارد کنید...',
    icon: 'solar:text-bold',
    color: '#6366f1',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    key: 'dashboard_subheader',
    label: 'متن زیرنویس صفحه',
    description: 'متن توضیحی زیر عنوان اصلی',
    placeholder: 'متن زیرنویس داشبورد را وارد کنید...',
    icon: 'solar:document-text-bold',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    key: 'terms_and_conditions',
    label: 'قوانین و مقررات',
    description: 'متن صفحه قوانین و شرایط استفاده از سایت',
    placeholder: 'قوانین و مقررات سایت را وارد کنید...',
    icon: 'solar:document-medicine-bold',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    key: 'about_us',
    label: 'درباره ما',
    description: 'متن صفحه درباره ما و معرفی سایت',
    placeholder: 'متن درباره ما را وارد کنید...',
    icon: 'solar:users-group-rounded-bold',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    key: 'comprehensive_report_system_prompt',
    label: 'پرامپت سیستم کارنامه جامع (۳۶۰)',
    description: 'پرامپت AI برای تولید کارنامه جامع ۳۶۰ درجه',
    placeholder: 'پرامپت سیستم را وارد کنید...',
    icon: 'solar:cpu-bolt-bold',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
  },
];

// ----------------------------------------------------------------------

export function SiteContentListView() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  const { data, isLoading } = useGetSiteContents();
  const { mutateAsync: updateContent } = useUpdateSiteContent();

  useEffect(() => {
    if (data?.data) {
      const initialValues = {};
      data.data.forEach((item) => {
        initialValues[item.key] = item.content || '';
      });
      setValues(initialValues);
    }
  }, [data]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await updateContent({ key, data: { content: values[key] || '' } });
      toast.success('محتوا با موفقیت ذخیره شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در ذخیره محتوا');
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const toggleExpand = (key) => {
    setExpandedCard(expandedCard === key ? null : key);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={32} sx={{ color: 'white' }} />
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          عبارات سامانه
        </Typography>
        <Typography variant="body1" color="text.secondary">
          مدیریت و ویرایش متن‌های داینامیک سایت
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: expandedCard
            ? '1fr'
            : { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {CONTENT_FIELDS.map((field) => {
          const isExpanded = expandedCard === field.key;
          if (expandedCard && !isExpanded) return null;

          return (
            <Card
              key={field.key}
              sx={{
                position: 'relative',
                overflow: 'visible',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: isExpanded ? 'none' : 'translateY(-4px)',
                  boxShadow: (theme) => `0 20px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                },
              }}
            >
              {/* Gradient Top Bar */}
              <Box
                sx={{
                  height: 4,
                  background: field.bgGradient,
                  borderRadius: '12px 12px 0 0',
                }}
              />

              <CardContent sx={{ p: 3 }}>
                {/* Card Header */}
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: field.bgGradient,
                        boxShadow: `0 4px 14px ${field.color}40`,
                      }}
                    >
                      <Iconify icon={field.icon} width={24} sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {field.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {field.description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Tooltip title={isExpanded ? 'حالت عادی' : 'تمام صفحه'}>
                    <IconButton
                      onClick={() => toggleExpand(field.key)}
                      sx={{
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' },
                      }}
                    >
                      <Iconify icon={isExpanded ? 'solar:minimize-square-linear' : 'solar:maximize-square-linear'} width={20} />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* Text Field */}
                <TextField
                  fullWidth
                  multiline
                  rows={isExpanded ? 12 : 5}
                  value={values[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        boxShadow: `0 0 0 2px ${field.color}30`,
                      },
                    },
                  }}
                />

                {/* Footer */}
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={() => handleSave(field.key)}
                    disabled={saving[field.key]}
                    startIcon={
                      saving[field.key] ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <Iconify icon="solar:diskette-bold" />
                      )
                    }
                    sx={{
                      px: 3,
                      borderRadius: 2,
                      background: field.bgGradient,
                      boxShadow: `0 4px 14px ${field.color}40`,
                      '&:hover': {
                        background: field.bgGradient,
                        boxShadow: `0 6px 20px ${field.color}50`,
                      },
                    }}
                  >
                    ذخیره تغییرات
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
