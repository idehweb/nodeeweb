import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

import { toast } from 'react-toastify';

import API from '@/functions/API';

import { afterAuth } from './utils';

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

  const onSubmit = async (data: {
    confirmPassword: string;
    password: string;
    verificationCode: string;
  }) => {
    if (data.confirmPassword !== data.password) {
      toast.error('عدم تطابق رمز عبور');
      return;
    }
    // Handle form submission here
    console.log(data);
    const updateUserResponse = await API.post('/auth/otp/signup', {
      userType: 'customer',
      user: {
        username: changes.countryCode + changes.phoneNumber.replace(/^0/, ''),
        phone: changes.countryCode + changes.phoneNumber.replace(/^0/, ''),
        password: data.password,
        code: data.verificationCode,
      },
    });
    console.log('update user response is #fgf2 ', updateUserResponse);
    localStorage.setItem('user', updateUserResponse.data.user);
    toast.success('ورود موفقیت آمیز');
    const token = updateUserResponse.data.token;
    const user = updateUserResponse.data.user;
    afterAuth({ user, token });

    try {
    } catch (error) {
      console.log('error trace code #fpf1');
      toast.error('خطا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}>
        <TextField
          name="phoneNumber"
          label="Phone Number"
          type="number"
          defaultValue={
            changes.countryCode + changes.phoneNumber.replace(/^0/, '')
          }
          disabled
          // {...register('phone', { required: true })}
        />
        <TextField
          name="newPassword"
          label="New Password"
          type="password"
          {...register('password', { required: true })}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', { required: true })}
        />
        <TextField
          name="verificationCode"
          label="Verification Code"
          type="text"
          {...register('verificationCode', { required: true })}
        />
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          color="primary">
          ثبت
        </Button>
      </Box>
    </form>
  );
}
