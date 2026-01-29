import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

// import { useUploadFile } from 'src/api';
import { HelperText } from './help-text';
// import UploadDocument from '../upload/upload-document';
import { Upload, UploadBox, UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, slotProps, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            <HelperText errorMessage={error?.message} sx={{ textAlign: 'center' }} />
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

// export function RHFUploadDocument({ name, slotProps, disabled, ...other }) {
//   const { control, setValue } = useFormContext();
//   const { upload, progress, isLoading, isSuccess, isFailed } = useUploadFile();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       disabled={disabled || isLoading}
//       render={({ field, fieldState: { error } }) => {
//         const onDrop = async (acceptedFiles) => {
//           const value = acceptedFiles[0];

//           setValue(name, value, { shouldValidate: true });

//           try {
//             const response = await upload(value);
//             setValue(`${name}_id`, response.data.id, { shouldValidate: true });
//           } catch (err) {
//             console.error(err);
//             setValue(name, null, { shouldValidate: true });
//           }
//         };

//         return (
//           <Box sx={{ position: 'relative' }}>
//             {isLoading && (
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: 1,
//                   left: 1,
//                   right: 1,
//                   bottom: 1,
//                   backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 1,
//                   backdropFilter: 'blur(2px)',
//                   borderRadius: 1,
//                   border: '1px solid',
//                   borderColor: 'divider',
//                 }}
//               >
//                 <Stack alignItems="center" spacing={1}>
//                   <Typography variant="caption">در حال آپلود... {progress}%</Typography>
//                   <CarouselProgressBar
//                     value={progress}
//                     color="primary"
//                     sx={{
//                       height: 8,
//                       borderRadius: 1,
//                       '& .MuiLinearProgress-bar': {
//                         borderRadius: 1,
//                       },
//                     }}
//                   />
//                 </Stack>
//               </Box>
//             )}
//             <UploadDocument
//               value={field.value}
//               error={!!error}
//               onDrop={onDrop}
//               progress={progress}
//               isSuccess={isSuccess}
//               isFailed={isFailed}
//               {...other}
//             />
//           </Box>
//         );
//       }}
//     />
//   );
// }

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, accept, ...other }) {
  const { control, setValue, getValues } = useFormContext();

  const idsField = `${name}_ids`;

  useEffect(() => {
    if (getValues(idsField)) return;

    if (multiple) {
      setValue(idsField, [], { shouldValidate: true });
    } else {
      setValue(idsField, null, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: accept ?? { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        const onUploadComplete = (file_id, index) => {
          const prevValue = structuredClone(getValues(idsField));

          if (multiple) {
            prevValue[index] = file_id;
            setValue(idsField, prevValue, { shouldValidate: true });
          } else {
            setValue(idsField, file_id, { shouldValidate: true });
          }
        };

        return (
          <Upload
            {...uploadProps}
            value={field.value}
            onDrop={onDrop}
            onUpload={onUploadComplete}
            {...other}
          />
        );
      }}
    />
  );
}
