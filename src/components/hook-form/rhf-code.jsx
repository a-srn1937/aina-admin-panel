import { MuiOtpInput } from 'mui-one-time-password-input';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { inputBaseClasses } from '@mui/material/InputBase';

import { HelperText } from './help-text';

// ----------------------------------------------------------------------

function matchIsNumeric(text) {
  const isNumber = typeof text === 'number';
  const isString = typeof text === 'string';
  return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
}

const validateChar = (value, index) => matchIsNumeric(value);

export function RHFCode({ name, slotProps, helperText, placeholder = '-', ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box
          {...slotProps?.wrapper}
          sx={[
            {
              [`& .${inputBaseClasses.input}`]: {
                p: 0,
                height: '56px',
              },
            },
            ...(Array.isArray(slotProps?.wrapper?.sx)
              ? (slotProps?.wrapper?.sx ?? [])
              : [slotProps?.wrapper?.sx]),
          ]}
        >
          <MuiOtpInput
            {...field}
            onChange={(value) => {
              // @ts-ignore
              value = value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

              // @ts-ignore
              value = value.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
              // if(checkNumber(value))
              field.onChange(value);
            }}
            autoFocus
            gap={4}
            length={4}
            validateChar={validateChar}
            TextFieldsProps={{
              type: 'number',
              placeholder,
              error: !!error,
              ...slotProps?.textfield,
            }}
            {...other}
          />

          <HelperText
            {...slotProps?.helperText}
            errorMessage={error?.message}
            helperText={helperText}
            sx={{ justifyContent: 'flex-end' }}
          />
        </Box>
      )}
    />
  );
}
