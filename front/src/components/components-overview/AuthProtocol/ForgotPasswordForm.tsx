import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

import { toast } from 'react-toastify';

import API from '@/functions/API';

// import { afterAuth } from './utils';

import { UserProps } from '.';

export default function ForgotPasswordForm({
  setChanges,
  changes,
}: {
  setChanges: Dispatch<SetStateAction<UserProps>>;
  changes: UserProps;
}) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      phone: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
    },
  });

  const onChangePasswordSubmit = async (data: {
    confirmPassword: string;
    password: string;
    verificationCode: string;
  }) => {
    if (data.confirmPassword !== data.password) {
      toast.error('عدم تطابق رمز عبور');
      return;
    }
    try {
      setLoading(true);
      const sendOtpToken = await API.post('/auth/otp', {
        userType: 'customer',
        login: true,
        signup: false,
        user: {
          phone: changes.phoneNumber,
        },
      });
      setChanges((prev) => ({
        ...prev,
        authStatus: 'change-password:active',
        tempPassword: data.password,
      }));
      console.log('otp token for reset pass traceback #fpf1 ', sendOtpToken);
      toast.success('کد با موفقیت ارسال شد');
    } catch (err) {
      console.log('error trace back code #ocps1');
      toast.error('خطا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onChangePasswordSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}>
        <TextField
          sx={{ fontFamily: 'inherit' }}
          name="phoneNumber"
          label="شماره همراه"
          type="number"
          defaultValue={
            changes.countryCode + changes.phoneNumber.replace(/^0/, '')
          }
          disabled
          // {...register('phone', { required: true })}
        />
        <TextField
          sx={{ fontFamily: 'inherit' }}
          name="newPassword"
          label="رمز عبور جدید"
          type="password"
          {...register('password', { required: true })}
        />
        <TextField
          sx={{ fontFamily: 'inherit' }}
          name="confirmPassword"
          label="تایید رمز عبور"
          type="password"
          {...register('confirmPassword', { required: true })}
        />
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          color="primary">
          ثبت
        </Button>
        <Button
          disabled={loading}
          onClick={() => {
            setChanges((prev) => ({
              ...prev,
              authStatus: 'detect',
              captcha: false,
            }));
          }}
          variant="outlined"
          color="warning"
          fullWidth>
          تغییر شماره موبایل
        </Button>
      </Box>
    </form>
  );
}
