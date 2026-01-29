import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CalendarToolbar({ title, loading, onDateNavigation }) {
  const renderDateNavigation = () => (
    <Box
      sx={{
        gap: { sm: 1 },
        display: 'flex',
        flex: '1 1 auto',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Tooltip title="هفته قبل">
        <IconButton onClick={() => onDateNavigation?.('prev')}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </IconButton>
      </Tooltip>

      <Box sx={{ width: 290, typography: { xs: 'subtitle2', sm: 'h6' } }}>{title}</Box>

      <Tooltip title="هفته بعد">
        <IconButton onClick={() => onDateNavigation?.('next')}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderToday = () => (
    <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
      <Button
        size="small"
        color="error"
        variant="contained"
        onClick={() => onDateNavigation?.('today')}
      >
        امروز
      </Button>
    </Box>
  );

  const renderLoading = () => (
    <LinearProgress
      color="inherit"
      sx={{
        left: 0,
        width: 1,
        height: 2,
        bottom: 0,
        borderRadius: 0,
        position: 'absolute',
      }}
    />
  );

  return (
    <Box
      sx={{ pr: 2, pl: 2.5, py: 2.5, display: 'flex', alignItems: 'center', position: 'relative' }}
    >
      {renderDateNavigation()}
      {renderToday()}
      {loading && renderLoading()}
    </Box>
  );
}
