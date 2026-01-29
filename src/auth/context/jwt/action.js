'use client';

import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in with password
 *************************************** */
export const signInWithPassword = async ({ phone, password }) => {
  try {
    const res = await axios.post(endpoints.auth.login, { phone, password });

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    setSession(access_token);
    return res.data;
  } catch (error) {
    console.error('خطایی هنگام احراز هویت رخ داده!', error);
    throw error;
  }
};

/** **************************************
 * Request OTP
 *************************************** */
export const requestOTP = async ({ phone }) => {
  try {
    const res = await axios.post(endpoints.auth.otpRequest, { phone });
    return res.data;
  } catch (error) {
    console.error('خطا در ارسال کد تایید:', error);
    throw error;
  }
};

/** **************************************
 * Verify OTP
 *************************************** */
export const verifyOTP = async ({ phone, code }) => {
  try {
    const res = await axios.post(endpoints.auth.otpVerify, { phone, code });

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    setSession(access_token);
    return res.data;
  } catch (error) {
    console.error('خطا در تایید کد:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

export { setSession };
