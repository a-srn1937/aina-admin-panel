import { useEffect, useCallback } from 'react';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

import { fData } from 'src/utils/format-number';

import { useUploadFile } from 'src/api';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';
import { fileData, FileThumbnail } from '../../file-thumbnail';

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  onUpload,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
  className,
  ...other
}) {
  return (
    <ListRoot
      thumbnail={thumbnail}
      className={mergeClasses([uploadClasses.uploadMultiPreview, className])}
      sx={sx}
      {...other}
    >
      {firstNode && <ItemNode thumbnail={thumbnail}>{firstNode}</ItemNode>}

      {files.map((file, index) => (
        <PreviewFileItem
          key={file.name}
          index={index}
          file={file}
          thumbnail={thumbnail}
          onRemove={onRemove}
          onUpload={onUpload}
          slotProps={slotProps}
        />
      ))}

      {lastNode && <ItemNode thumbnail={thumbnail}>{lastNode}</ItemNode>}
    </ListRoot>
  );
}

export function PreviewFileItem({ file, thumbnail, onRemove, onUpload, slotProps, index }) {
  const { name, size } = fileData(file);

  const { upload, progress, isLoading, isSuccess, isFailed, reset } = useUploadFile();

  const handleUpload = useCallback(() => {
    upload(file)
      .then((response) => {
        onUpload(response.data.id, index);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => handleUpload(), []);

  if (thumbnail) {
    return (
      <ItemThumbnail key={name}>
        <FileThumbnail
          tooltip
          imageView
          file={file}
          onRemove={() => onRemove?.(file)}
          sx={[
            (theme) => ({
              width: 80,
              height: 80,
              border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }),
          ]}
          slotProps={{ icon: { sx: { width: 36, height: 36 } } }}
          {...slotProps?.thumbnail}
        />
      </ItemThumbnail>
    );
  }

  return (
    <ItemRow key={name} sx={{ borderColor: isFailed ? 'error.main' : 'inherit' }}>
      <FileThumbnail file={file} {...slotProps?.thumbnail} />

      <ListItemText
        primary={name}
        secondary={fData(size)}
        slotProps={{
          secondary: { sx: { typography: 'caption' } },
        }}
      />

      {isLoading && <CircularProgressWithLabel value={progress} color="primary" />}

      {onRemove && isSuccess ? (
        <IconButton size="small" onClick={() => onRemove(file)}>
          <Iconify width={16} icon="mingcute:close-line" />
        </IconButton>
      ) : null}

      {isFailed && (
        <Tooltip title="بارگزاری مجدد">
          <IconButton
            size="small"
            onClick={() => {
              reset();
              handleUpload();
            }}
          >
            <Iconify width={16} icon="eva:refresh-fill" />
          </IconButton>
        </Tooltip>
      )}
    </ItemRow>
  );
}

// ----------------------------------------------------------------------

export function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const ListRoot = styled('ul', {
  shouldForwardProp: (prop) => !['thumbnail', 'sx'].includes(prop),
})(({ thumbnail, theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'column',
  ...(thumbnail && { flexWrap: 'wrap', flexDirection: 'row' }),
}));

const ItemThumbnail = styled('li')(() => ({ display: 'inline-flex' }));

const ItemRow = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 1, 1, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
}));

const ItemNode = styled('li', {
  shouldForwardProp: (prop) => !['thumbnail', 'sx'].includes(prop),
})(({ thumbnail }) => ({
  ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
}));
