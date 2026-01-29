import PropTypes from 'prop-types';

import { Box, Stack, IconButton, Typography, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { useVoiceRecorder } from '../hooks/use-voice-recorder';

/**
 * Voice recorder button component
 * Displays a floating button that toggles voice recording
 */
export function VoiceRecorderButton({ meetingId, sx, ...other }) {
  const { 
    isRecording, 
    isPaused, 
    isConnected, 
    recordingDuration, 
    toggleRecording,
    togglePause,
  } = useVoiceRecorder(meetingId);
  
  // Format duration as HH:MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStopClick = async () => {
    try {
      await toggleRecording();
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const handlePauseClick = (e) => {
    e.stopPropagation();
    togglePause();
  };

  // If not recording, show start button
  if (!isRecording) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        onClick={handleStopClick}
        sx={{
          cursor: 'pointer',
          position: 'fixed',
          bottom: 30,
          right: 120,
          height: 68,
          bgcolor: 'background.neutral',
          border: '10px solid',
          borderColor: 'grey.300',
          borderRadius: '25px',
          p: 1,
          px: 2,
          fontWeight: 'bold',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: 'grey.400',
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          ...sx,
        }}
        {...other}
      >
        {!isConnected ? (
          <CircularProgress size={20} />
        ) : (
          <Iconify icon="uim:record-audio" sx={{ color: 'error.darker' }} />
        )}
        آغاز ضبط
      </Stack>
    );
  }

  // If recording, show pause/stop buttons
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 120,
        height: 68,
        bgcolor: isPaused ? 'warning.lighter' : 'error.lighter',
        border: '10px solid',
        borderColor: isPaused ? 'warning.main' : 'error.main',
        borderRadius: '25px',
        p: 1,
        px: 2,
        fontWeight: 'bold',
        transition: 'all 0.3s ease-in-out',
        ...sx,
      }}
      {...other}
    >
      {/* Recording info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify
          icon={isPaused ? 'mdi:pause-circle' : 'mdi:record-circle'}
          sx={{
            color: isPaused ? 'warning.darker' : 'error.darker',
            animation: isPaused ? 'none' : 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
            {isPaused ? 'موقتاً متوقف' : 'در حال ضبط'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
            {formatDuration(recordingDuration)}
          </Typography>
        </Box>
      </Box>

      {/* Control buttons */}
      <Stack direction="row" spacing={0.5}>
        {/* Pause/Resume button */}
        <IconButton
          size="small"
          onClick={handlePauseClick}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Iconify
            icon={isPaused ? 'mdi:play' : 'mdi:pause'}
            sx={{ fontSize: 20 }}
          />
        </IconButton>

        {/* Stop button */}
        <IconButton
          size="small"
          onClick={handleStopClick}
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          <Iconify icon="mdi:stop" sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

VoiceRecorderButton.propTypes = {
  meetingId: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
