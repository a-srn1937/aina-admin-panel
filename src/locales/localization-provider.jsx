'use client';

import 'dayjs/locale/fa';

import dayjs from 'dayjs';
import jalaliday from 'jalali-plugin-dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';

import { useTranslate } from './use-locales';

// ----------------------------------------------------------------------

export function LocalizationProvider({ children }) {
  const { currentLang } = useTranslate();

  dayjs.extend(jalaliday);
  dayjs.locale('fa');
  dayjs.calendar('jalali');

  return (
    <Provider
      dateAdapter={AdapterDayjs}
      adapterLocale="fa"
      localeText={
        currentLang.systemValue.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      {children}
    </Provider>
  );
}
