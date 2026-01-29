'use client';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { verifyOTP, requestOTP, signInWithPassword } from 'src/auth/context/jwt';

import { FormHead } from '../../components/form-head';

// ----------------------------------------------------------------------

const SignInSchema = zod.object({
  phone: zod
    .string({ required_error: 'شماره موبایل را وارد کنید' })
    .min(10, { message: 'شماره موبایل معتبر نیست' }),
  password: zod
    .string({ required_error: 'رمز عبور را وارد کنید' })
    .min(1, { message: 'رمز عبور را وارد کنید' }),
});

const OTPPhoneSchema = zod.object({
  phone: zod
    .string({ required_error: 'شماره موبایل را وارد کنید' })
    .min(10, { message: 'شماره موبایل معتبر نیست' }),
});

const OTPCodeSchema = zod.object({
  code: zod
    .string({ required_error: 'کد تایید را وارد کنید' })
    .min(4, { message: 'کد تایید معتبر نیست' }),
});

// ----------------------------------------------------------------------

function normalizePhone(phone) {
  let normalized = phone.replace(/\D/g, '');
  if (normalized.startsWith('0')) {
    normalized = `+98${normalized.slice(1)}`;
  } else if (normalized.startsWith('98')) {
    normalized = `+${normalized}`;
  } else if (normalized.startsWith('9')) {
    normalized = `+98${normalized}`;
  }
  return normalized;
}

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp-phone' | 'otp-code'
  const [otpPhone, setOtpPhone] = useState('');

  // Password login form
  const passwordMethods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: { phone: '', password: '' },
  });

  // OTP phone form
  const otpPhoneMethods = useForm({
    resolver: zodResolver(OTPPhoneSchema),
    defaultValues: { phone: '' },
  });

  // OTP code form
  const otpCodeMethods = useForm({
    resolver: zodResolver(OTPCodeSchema),
    defaultValues: { code: '' },
  });

  const handleLoginSuccess = async () => {
    const user = await checkUserSession();
    if (!user) {
      setErrorMsg('شما دسترسی ادمین ندارید');
      return;
    }
    toast.success(`${user.first_name || ''} ${user.last_name || ''} خوش آمدید`);
    router.push(paths.dashboard.root);
  };

  // Password login
  const onPasswordSubmit = passwordMethods.handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const phone = normalizePhone(data.phone);
      await signInWithPassword({ phone, password: data.password });
      await handleLoginSuccess();
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.response?.data?.message || 'شماره موبایل یا رمز عبور اشتباه است');
    }
  });

  // Request OTP
  const onOTPPhoneSubmit = otpPhoneMethods.handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const phone = normalizePhone(data.phone);
      await requestOTP({ phone });
      setOtpPhone(phone);
      setLoginMode('otp-code');
      toast.success('کد تایید ارسال شد');
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.response?.data?.message || 'خطا در ارسال کد تایید');
    }
  });

  // Verify OTP
  const onOTPCodeSubmit = otpCodeMethods.handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await verifyOTP({ phone: otpPhone, code: +data.code });
      await handleLoginSuccess();
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.response?.data?.message || 'کد تایید اشتباه است');
    }
  });

  const switchToOTP = () => {
    setErrorMsg('');
    setLoginMode('otp-phone');
    otpPhoneMethods.reset();
  };

  const switchToPassword = () => {
    setErrorMsg('');
    setLoginMode('password');
    passwordMethods.reset();
  };

  const backToOTPPhone = () => {
    setErrorMsg('');
    setLoginMode('otp-phone');
    otpCodeMethods.reset();
  };

  // Password Login View
  if (loginMode === 'password') {
    return (
      <>
        <FormHead
          title="ورود به پنل مدیریت"
          description="با شماره موبایل و رمز عبور وارد شوید"
          sx={{ textAlign: 'center', mt: 6, mb: 4 }}
        />

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <Form key="password-form" methods={passwordMethods} onSubmit={onPasswordSubmit}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={2.5}>
              <Field.Text
                name="phone"
                label="شماره موبایل"
                placeholder="09123456789"
                slotProps={{ htmlInput: { dir: 'ltr' } }}
              />

              <Field.Text
                name="password"
                type="password"
                label="رمز عبور"
                slotProps={{ htmlInput: { dir: 'ltr' } }}
              />
            </Stack>

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              loading={passwordMethods.formState.isSubmitting}
              loadingIndicator="در حال ورود..."
            >
              ورود
            </Button>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                یا
              </Typography>
            </Divider>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={switchToOTP}
            >
              ورود با کد یکبار مصرف
            </Button>
          </Box>
        </Form>
      </>
    );
  }

  // OTP Phone View
  if (loginMode === 'otp-phone') {
    return (
      <>
        <FormHead
          title="ورود با کد یکبار مصرف"
          description="شماره موبایل خود را وارد کنید"
          sx={{ textAlign: 'center', mt: 6, mb: 4 }}
        />

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <Form key="otp-phone-form" methods={otpPhoneMethods} onSubmit={onOTPPhoneSubmit}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <Field.Text
              name="phone"
              label="شماره موبایل"
              placeholder="09123456789"
              slotProps={{ htmlInput: { dir: 'ltr' } }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              loading={otpPhoneMethods.formState.isSubmitting}
              loadingIndicator="در حال ارسال..."
            >
              ارسال کد تایید
            </Button>

            <Button
              fullWidth
              size="large"
              variant="text"
              onClick={switchToPassword}
            >
              بازگشت به ورود با رمز عبور
            </Button>
          </Box>
        </Form>
      </>
    );
  }

  // OTP Code View
  return (
    <>
      <FormHead
        title="تایید کد"
        description={`کد ارسال شده به ${otpPhone} را وارد کنید`}
        sx={{ textAlign: 'center', mt: 6, mb: 4 }}
      />

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form key="otp-code-form" methods={otpCodeMethods} onSubmit={onOTPCodeSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="code"
            label="کد تایید"
            placeholder="1234"
            slotProps={{ htmlInput: { dir: 'ltr', maxLength: 6 } }}
          />

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            loading={otpCodeMethods.formState.isSubmitting}
            loadingIndicator="در حال تایید..."
          >
            تایید و ورود
          </Button>

          <Button
            fullWidth
            size="large"
            variant="text"
            onClick={backToOTPPhone}
          >
            تغییر شماره موبایل
          </Button>
        </Box>
      </Form>
    </>
  );
}
