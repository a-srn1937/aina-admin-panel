import { Controller, useFormContext } from 'react-hook-form';
import { isFunction, get as getObj } from 'es-toolkit/compat';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Chip, Checkbox, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export function RHFAutocomplete({
  name,
  label,
  freeSolo,
  multiple,
  // options,
  // getOptionLabel,
  // optionLabel,
  // optionValue,
  options,
  getOptionLabel,
  optionLabel = 'label',
  optionValue = 'value',
  checkbox,
  chip,
  slotProps,
  helperText,
  placeholder,
  ...other
}) {
  const { control, setValue } = useFormContext();

  const { textField, ...otherSlotProps } = slotProps ?? {};

  const labelId = `${name}-multi-select`;

  const getOptLabel = (option) =>
    isFunction(getOptionLabel) ? getOptionLabel(option) : getObj(option, optionLabel);

  // const getOptLabel = useCallback(
  //   (value) => {
  //     console.log(label, value);
  //     if (isFunction(getOptionLabel)) return getOptionLabel(value);
  //     return getObj(value, optionLabel);
  //   },
  //   [getOptionLabel, label, optionLabel]
  // );

  // const renderOption = (props, option) => {
  //   console.log('render option : ', props, option);
  //   return (
  //   <MenuItem {...props} key={option.id}>
  //     {getOptLabel(option)}
  //   </MenuItem>
  // )};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // const renderLabel = () => (
        //   <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
        //     {label}
        //   </InputLabel>
        // );

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

        // const handleChange = (_, newValue) => {
        //   console.log(newValue);
        //   if (multiple) {
        //     if (optionValue)
        //       setValue(
        //         name,
        //         newValue.map((item) => getObj(item, optionValue)),
        //         {
        //           shouldValidate: true,
        //         }
        //       );
        //     else setValue(name, newValue, { shouldValidate: true });
        //   } else {
        //     if (optionValue)
        //       setValue(name, getObj(newValue, optionValue), { shouldValidate: true });
        //     else setValue(name, newValue, { shouldValidate: true });
        //   }
        // };

        return (
          <Autocomplete
            {...field}
            id={`${name}-rhf-autocomplete`}
            // options={options}
            // getOptionLabel={getOptLabel}
            multiple={multiple}
            freeSolo={freeSolo}
            // onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textField}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message ?? helperText}
                slotProps={{
                  ...textField?.slotProps,
                  htmlInput: {
                    ...params.inputProps,
                    ...textField?.slotProps?.htmlInput,
                    autoComplete: 'new-password', // Disable autocomplete and autofill
                  },
                }}
              />
            )}
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
                        {...slotProps?.chip}
                      />
                    ))}
                  </Box>
                );
              }

              return selectedItems.map((item) => item.label).join(', ');
            }}
            // renderOption={renderOption}
            slotProps={{
              ...otherSlotProps,
              chip: {
                size: 'small',
                variant: 'soft',
                ...otherSlotProps?.chip,
              },
            }}
            {...other}
          >
            {renderOptions()}
          </Autocomplete>
        );
      }}
    />
  );
}
