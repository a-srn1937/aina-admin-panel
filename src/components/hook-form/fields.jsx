import { RHFCode } from '.';
import { RHFRating } from './rhf-rating';
import { RHFSlider } from './rhf-slider';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar } from './rhf-upload';
import {
  RHFDatePicker,
  RHFTimePicker,
  RHFDateTimePicker,
  RHFMobileDateTimePicker,
} from './rhf-date-picker';

// ----------------------------------------------------------------------

export const Field = {
  Code: RHFCode,
  Select: RHFSelect,
  Switch: RHFSwitch,
  Slider: RHFSlider,
  Upload: RHFUpload,
  Rating: RHFRating,
  Text: RHFTextField,
  Checkbox: RHFCheckbox,
  UploadBox: RHFUploadBox,
  RadioGroup: RHFRadioGroup,
  MultiSelect: RHFMultiSelect,
  MultiSwitch: RHFMultiSwitch,
  UploadAvatar: RHFUploadAvatar,
  Autocomplete: RHFAutocomplete,
  MultiCheckbox: RHFMultiCheckbox,
  // UploadDocument: RHFUploadDocument,
  // Pickers
  DatePicker: RHFDatePicker,
  TimePicker: RHFTimePicker,
  DateTimePicker: RHFDateTimePicker,
  MobileDateTimePicker: RHFMobileDateTimePicker,
};
