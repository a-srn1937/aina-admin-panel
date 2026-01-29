'use client';

import { useEffect, useCallback } from 'react';
import { useCountdownSeconds } from 'minimal-shared/hooks';

import { Button } from '@mui/material';

import { useRequestOTP } from 'src/api/auth';

function ResendCounter({ seconds = 120, oncountdownEnd = () => {}, mobile }) {
  const { mutateAsync: requestOtp } = useRequestOTP();

  const { start, value, reset } = useCountdownSeconds(seconds);

  const resendCode = useCallback(async () => {
    await requestOtp({ phone: mobile }).then(() => {
      reset();
      start();
      oncountdownEnd();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile, requestOtp]);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button color="primary" onClick={resendCode} disabled={value > 0} variant="text">
      ارسال مجدد کد
      {value > 0 && ` (${value} ثانیه) `}
    </Button>
  );
}

export default ResendCounter;
