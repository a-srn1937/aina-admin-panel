'use client';

import { useCallback } from 'react';

import { CONFIG } from 'src/global-config';
import axiosInstance, { endpoints } from 'src/lib/axios';

import { toast } from 'src/components/snackbar';

export const useDownloadFile = () => {
  const download = useCallback(async ({ file, title }) => {
    try {
      const url = `${CONFIG.serverUrl}${endpoints.file.details(file.path)}`;
      const blob = await axiosInstance.get(url, { responseType: 'blob' });

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = file?.original_name || title || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('دانلود انجام نشد');
    }
  }, []);

  return {
    download,
  };
};
