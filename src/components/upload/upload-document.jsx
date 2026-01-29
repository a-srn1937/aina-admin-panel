'use client';

import { useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { TextField } from '@mui/material';

import { Iconify } from '../iconify';
import { uploadClasses } from './classes';
import { RejectionFiles } from './components/rejection-files';

// ----------------------------------------------------------------------

export default function UploadDocument({
  sx,
  error,
  label,
  value,
  disabled,
  helperText,
  placeholder,
  className,
  isSuccess,
  isFailed,
  accept,
  onDrop,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: accept ?? { 'image/*': [] },
    onDrop,
    ...other,
  });

  const ref = useRef(null);

  const hasFile = !!value;

  const hasError = isDragReject || !!error;

  useEffect(() => {
    if (value && !value.path) {
      onDrop([value]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TextField
        label={label}
        variant="outlined"
        error={hasError}
        value={value?.name}
        placeholder="انتخاب فایل"
        fullWidth
        slotProps={{
          input: {
            endAdornment: <Iconify icon="solar:file-text-bold" sx={{ color: 'text.disabled' }} />,
          },
          htmlInput: {
            sx: {
              cursor: 'pointer',
            },
          },
        }}
        {...getRootProps()}
        className={mergeClasses([uploadClasses.uploadBox, className])}
        onFocus={(ev) => {
          ev.currentTarget.blur();
          ref.current?.click();
        }}
        sx={[
          (theme) => {
            const color = () => {
              if (hasError || isFailed) return theme.palette.error.main;
              if (isSuccess) return theme.palette.success.main;
              if (hasFile || isDragActive) return theme.palette.primary.main;
              return 'rgba(0, 0, 0, 0.23)';
            };

            return {
              color: 'text.disabled',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: color(),
                },
                '&:hover fieldset': {
                  borderColor: color(),
                },
                '&.Mui-focused fieldset': {
                  borderColor: color(),
                },
              },
              ...(isDragActive && { opacity: 0.72 }),
              ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
              ...(hasFile && {
                ...(hasError && { bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08) }),
                '&:hover .upload-placeholder': { opacity: 1 },
              }),
            };
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />

      <input ref={ref} {...getInputProps()} />

      {helperText && helperText}

      {!!fileRejections.length && <RejectionFiles files={fileRejections} />}
    </>
  );
}
