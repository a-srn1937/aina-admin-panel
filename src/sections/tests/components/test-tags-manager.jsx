'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import {
  useGetTags,
  useGetTestTags,
  useAssignTagToTest,
  useRemoveTagFromTest,
  useUpdateTestMatchingLogic,
} from 'src/api';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TestTagsManager({ testId }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [matchingLogic, setMatchingLogic] = useState('OR');

  const { data: tagsData } = useGetTags();
  const allTags = tagsData?.data || [];

  const { data: testTagsData, isLoading, refetch } = useGetTestTags(testId);
  const testTags = testTagsData?.data?.tags || [];
  const currentLogic = testTagsData?.data?.matching_logic || 'OR';

  const { mutateAsync: assignTag } = useAssignTagToTest();
  const { mutateAsync: removeTag } = useRemoveTagFromTest();
  const { mutateAsync: updateLogic } = useUpdateTestMatchingLogic();

  useEffect(() => {
    if (testTags.length > 0) {
      setSelectedTags(testTags.map((tag) => tag.id));
    }
    setMatchingLogic(currentLogic);
  }, [testTags, currentLogic]);

  const handleAddTags = async () => {
    try {
      const newTags = selectedTags.filter((tagId) => !testTags.find((t) => t.id === tagId));

      for (const tagId of newTags) {
        await assignTag({ testId, data: { tag_id: tagId, matching_logic: matchingLogic } });
      }

      await refetch();
      toast.success('تگ‌ها با موفقیت اضافه شدند');
    } catch (error) {
      console.error(error);
      toast.error('خطا در اضافه کردن تگ‌ها');
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await removeTag({ testId, tagId });
      await refetch();
      setSelectedTags((prev) => prev.filter((id) => id !== tagId));
      toast.success('تگ با موفقیت حذف شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف تگ');
    }
  };

  const handleLogicChange = async (newLogic) => {
    try {
      await updateLogic({ testId, data: { matching_logic: newLogic } });
      await refetch();
      setMatchingLogic(newLogic);
      toast.success('منطق تطبیق با موفقیت تغییر کرد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در تغییر منطق تطبیق');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              تگ‌های آزمون
            </Typography>
            <Typography variant="caption" color="text.secondary">
              فقط کاربرانی که تگ‌های مناسب دارند این آزمون را خواهند دید
            </Typography>
          </Box>

          {/* Current Tags */}
          {testTags.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                تگ‌های فعلی:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {testTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={`${tag.name} (${tag.category?.name})`}
                    onDelete={() => handleRemoveTag(tag.id)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Add Tags */}
          <FormControl fullWidth>
            <InputLabel>انتخاب تگ‌ها</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(e.target.value)}
              input={<OutlinedInput label="انتخاب تگ‌ها" />}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const tag = allTags.find((t) => t.id === id);
                    return tag ? `${tag.name} (${tag.category?.name})` : '';
                  })
                  .join(', ')
              }
            >
              {allTags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name} ({tag.category?.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Matching Logic */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="body2">منطق تطبیق:</Typography>
              <Tooltip title="OR: کاربر باید حداقل یکی از تگ‌ها را داشته باشد | AND: کاربر باید همه تگ‌ها را داشته باشد">
                <Box component="span" sx={{ display: 'inline-flex' }}>
                  <Iconify icon="mdi:information-outline" width={18} />
                </Box>
              </Tooltip>
            </Stack>

            <RadioGroup
              row
              value={matchingLogic}
              onChange={(e) => handleLogicChange(e.target.value)}
            >
              <FormControlLabel value="OR" control={<Radio />} label="OR (یکی از تگ‌ها)" />
              <FormControlLabel value="AND" control={<Radio />} label="AND (همه تگ‌ها)" />
            </RadioGroup>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddTags}
            startIcon={<Iconify icon="mdi:tag-plus" />}
            disabled={selectedTags.length === 0}
          >
            اعمال تگ‌ها
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
