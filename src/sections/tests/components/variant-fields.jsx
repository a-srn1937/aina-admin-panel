'use client';

import { useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useGetLanguages } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VARIANT_TYPES = [
  { value: 'self', label: 'خود (Self)' },
  { value: 'other', label: 'دیگری (Other)' },
];

// ----------------------------------------------------------------------

export function VariantFields({ control, name, label = 'متن', textFieldName = 'text' }) {
  const { data: languagesData } = useGetLanguages();
  const languages = languagesData || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2">ترجمه‌ها</Typography>
        <Button
          size="small"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() =>
            append({
              [textFieldName]: '',
              variant_type: 'self',
              language_id: '',
            })
          }
        >
          افزودن
        </Button>
      </Box>

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              position: 'relative',
            }}
          >
            {fields.length > 1 && (
              <IconButton
                size="small"
                onClick={() => remove(index)}
                sx={{ position: 'absolute', top: 4, left: 4 }}
              >
                <Iconify icon="mdi:close" width={18} />
              </IconButton>
            )}

            <Stack spacing={2}>
              <Box
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}
              >
                <Field.Select name={`${name}.${index}.language_id`} label="زبان" size="small">
                  {languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name={`${name}.${index}.variant_type`} label="نوع" size="small">
                  {VARIANT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Field.Text name={`${name}.${index}.${textFieldName}`} label={label} size="small" />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
