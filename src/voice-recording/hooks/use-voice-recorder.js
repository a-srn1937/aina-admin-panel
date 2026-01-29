import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useRef, useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/global-config';

/**
 * Custom hook for voice recording with Socket.IO streaming
 * @param {string} meetingId - The meeting ID to send with socket events
 * @returns {Object} Recording state and controls
 */
export function useVoiceRecorder(meetingId) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const processorNodeRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const isPausedRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = CONFIG.serverUrl.replace('/api', '');
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket'],
      query: { meetingId },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (err) => {
      setError(`خطا در اتصال: ${err.message}`);
      setIsConnected(false);
    });

    socketRef.current.on('voice:transcript', ({ text, status }) => {
      if (status === 'session_started') {
        console.log('Session started');
        return;
      }
      if (text) {
        setTranscript(text);
      }
    });

    socketRef.current.on('voice:final', ({ text }) => {
      if (text) {
        setTranscript(text);
      }
    });

    socketRef.current.on('voice:error', (msg) => {
      setError(`خطا: ${msg}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [meetingId]);

  // Audio processing utilities
  const floatTo16BitPCM = useCallback((float32Array) => {
    const out = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }, []);

  const downsampleFloat32 = useCallback((buffer, inRate, outRate) => {
    if (outRate === inRate) return buffer;
    const ratio = inRate / outRate;
    const newLen = Math.floor(buffer.length / ratio);
    if (!isFinite(newLen) || newLen <= 0) return new Float32Array(0);
    
    const result = new Float32Array(newLen);
    let pos = 0;
    let idx = 0;
    
    while (idx < newLen) {
      const nextPos = Math.round((idx + 1) * ratio);
      let sum = 0;
      let count = 0;
      
      for (let i = pos; i < nextPos && i < buffer.length; i++) {
        sum += buffer[i];
        count++;
      }
      
      result[idx] = count ? sum / count : 0;
      pos = nextPos;
      idx++;
    }
    
    return result;
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',
      });
      audioContextRef.current = audioContext;

      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      const bufferSize = 4096;
      const processorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
      processorNodeRef.current = processorNode;

      // Emit start event to socket
      socketRef.current.emit('voice:start', {
        audio_format: 'pcm_s16le',
        sample_rate: 16000,
        num_channels: 1,
        translation: 'none',
        language_hints: ['fa'],
        meetingId,
      });

      const inputSampleRate = audioContext.sampleRate;
      const targetRate = 16000;

      // Process audio chunks
      processorNode.onaudioprocess = (e) => {
        if (isPausedRef.current) return; // Skip if paused
        
        const input = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleFloat32(input, inputSampleRate, targetRate);
        
        if (!downsampled.length) return;
        
        const pcm16 = floatTo16BitPCM(downsampled);
        socketRef.current.emit('voice:chunk', pcm16.buffer);
      };

      sourceNode.connect(processorNode);
      processorNode.connect(audioContext.destination);

      setIsRecording(true);
      setIsPaused(false);
      isPausedRef.current = false;
      recordingStartTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      setRecordingDuration(0);
      
      // Start timer
      timerIntervalRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current - pausedTimeRef.current) / 1000);
          setRecordingDuration(elapsed);
        }
      }, 1000);
      
      toast.success('ضبط با موفقیت شروع شد');
    } catch (err) {
      setError(`خطای دسترسی به میکروفون: ${err.message}`);
      throw err;
    }
  }, [meetingId, downsampleFloat32, floatTo16BitPCM]);

  // Stop recording
  const stopRecording = useCallback(() => {
    try {
      if (socketRef.current) {
        socketRef.current.emit('voice:stop');
      }

      if (processorNodeRef.current) {
        processorNodeRef.current.disconnect();
        processorNodeRef.current.onaudioprocess = null;
        processorNodeRef.current = null;
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      setIsRecording(false);
      setIsPaused(false);
      isPausedRef.current = false;
      setRecordingDuration(0);
      recordingStartTimeRef.current = null;
      pausedTimeRef.current = 0;
      
      toast.info('ضبط متوقف شد');
    } catch (err) {
      setError(`خطا در توقف ضبط: ${err.message}`);
    }
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (!isRecording || isPaused) return;
    
    isPausedRef.current = true;
    setIsPaused(true);
    
    // Save pause start time
    pausedTimeRef.pauseStart = Date.now();
    
    toast.info('ضبط موقتاً متوقف شد');
  }, [isRecording, isPaused]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (!isRecording || !isPaused) return;
    
    isPausedRef.current = false;
    setIsPaused(false);
    
    // Add paused duration to total paused time
    if (pausedTimeRef.pauseStart) {
      pausedTimeRef.current += Date.now() - pausedTimeRef.pauseStart;
      delete pausedTimeRef.pauseStart;
    }
    
    toast.success('ضبط از سر گرفته شد');
  }, [isRecording, isPaused]);

  // Toggle pause/resume
  const togglePause = useCallback(() => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  }, [isPaused, pauseRecording, resumeRecording]);

  // Toggle recording
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Prevent page unload during recording (even if paused)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue = 'ضبط در حال انجام است. آیا مطمئن هستید که می‌خواهید صفحه را ببندید؟';
        return e.returnValue;
      }
      return undefined;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      stopRecording();
    }, [stopRecording]);

  return {
    isRecording,
    isPaused,
    isConnected,
    transcript,
    error,
    recordingDuration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    togglePause,
    toggleRecording,
  };
}
