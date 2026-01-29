'use client';

import { useRef, useState, useEffect } from 'react';

import { Box, Card, Slider, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function AudioPlayer({ src, sx, ...other }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      sx={{
        bgcolor: (theme) => theme.palette.grey[200],
        p: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: 1,
          bgcolor: 'background.paper',
          ...sx,
        }}
        {...other}
      >
        <audio ref={audioRef} src={src} preload="metadata" />

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              typography: 'caption',
              color: 'text.secondary',
              minWidth: 45,
            }}
          >
            {formatTime(duration)} /{formatTime(currentTime)}
          </Box>

          <Slider
            disabled={!src}
            // track="inverted"
            value={duration - currentTime}
            max={duration || 100}
            // color="primary"
            color="secondary"
            onChange={(event, newValue) => handleSliderChange(event, duration - newValue)}
            sx={{
              flex: 1,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
              '& .MuiSlider-track': {
                height: 4,
                backgroundColor: (theme) => theme.palette.grey[400],
              },
              '& .MuiSlider-rail': {
                height: 4,
                backgroundColor: (theme) => theme.palette.common.black,
              },
            }}
          />
        </Box>

        <IconButton
          size="small"
          sx={{
            width: 32,
            height: 32,
            color: 'text.primary',
          }}
        >
          <Iconify icon="solar:stop-bold" width={20} />
        </IconButton>

        <IconButton
          onClick={togglePlayPause}
          size="small"
          sx={{
            width: 32,
            height: 32,
            color: 'text.primary',
          }}
        >
          <Iconify icon={isPlaying ? 'solar:pause-bold' : 'solar:play-bold'} width={20} />
        </IconButton>
      </Box>
    </Card>
  );
}

export default AudioPlayer;
