import { merge, isFunction } from 'es-toolkit';
import { get as getObj } from 'es-toolkit/compat';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { HelperText } from './help-text';

// ----------------------------------------------------------------------

export function RHFSelect({ name, children, helperText, slotProps = {}, ...other }) {
  const { control } = useFormContext();

  const labelId = `${name}-select`;

  const baseSlotProps = {
    select: {
      sx: { textTransform: 'capitalize' },
      MenuProps: {
        slotProps: {
          paper: {
            sx: [{ maxHeight: 220 }],
          },
        },
      },
    },
    htmlInput: { id: labelId },
    inputLabel: { htmlFor: labelId },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={merge(baseSlotProps, slotProps)}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  getOptionLabel,
  optionLabel = 'label',
  optionValue = 'value',
  checkbox,
  placeholder,
  slotProps,
  helperText,
  ...other
}) {
  const { control } = useFormContext();

  const labelId = `${name}-multi-select`;

  const getOptLabel = (option) =>
    isFunction(getOptionLabel) ? getOptionLabel(option) : getObj(option, optionLabel);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const renderLabel = () => (
          <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
            {label}
          </InputLabel>
        );

        const renderOptions = () =>
          options.map((option) => (
            <MenuItem key={getObj(option, optionValue)} value={getObj(option, optionValue)}>
              {checkbox && (
                <Checkbox
                  size="small"
                  disableRipple
                  checked={field.value.includes(getObj(option, optionValue))}
                  {...slotProps?.checkbox}
                />
              )}
              {getOptLabel(option)}
            </MenuItem>
          ));

        return (
          <FormControl error={!!error} {...other}>
            {label && renderLabel()}

            <Select
              {...field}
              multiple
              displayEmpty={!!placeholder}
              label={label}
              renderValue={(selected) => {
                const selectedItems = options.filter((item) =>
                  selected.includes(getObj(item, optionValue))
                );

                if (!selectedItems.length && placeholder) {
                  return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
                }

                if (chip) {
                  return (
                    <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                      {selectedItems.map((item) => (
                        <Chip
                          key={getObj(item, optionValue)}
                          size="small"
                          variant="soft"
                          label={getOptLabel(item)}
                          // avatar={slotProps?.chip?.avatar?.(item)}
                          // onDelete={slotProps?.chip?.onDelete?.(item)}
                          {...slotProps?.chip}
                        />
                      ))}
                    </Box>
                  );
                }

                return selectedItems.map((item) => item.label).join(', ');
              }}
              {...slotProps?.select}
              inputProps={{
                id: labelId,
                ...slotProps?.select?.inputProps,
              }}
            >
              {renderOptions()}
            </Select>

            <HelperText
              {...slotProps?.helperText}
              errorMessage={error?.message}
              helperText={helperText}
            />
          </FormControl>
        );
      }}
    />
  );
}
