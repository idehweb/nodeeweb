import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';

import { toast } from 'react-toastify';

import API from '@/functions/API';

import { afterAuth } from './utils';

import { UserProps } from '.';
import { useTranslation } from 'react-i18next';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm({
  setChanges,
  changes,
}: {
  setChanges: Dispatch<SetStateAction<UserProps>>;
  changes: UserProps;
}) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      confirmPassword: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: changes.phoneNumber,
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [otp, setOtp] = React.useState(true);
  const [error, setError] = React.useState('');

  const onSubmit = async (e: FormData) => {
    if (e.confirmPassword !== e.password) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Make API call
      const signupResponse = await API.post('/auth/otp-pass/signup', {
        userType: 'customer',
        user: {
          code: changes.activationCode,
          phone: changes.phoneNumber,
          password: e.password,
          firstName: e.firstName,
          lastName: e.lastName,
        },
      });

      console.log('signup response is --- >');
      localStorage.setItem('user', signupResponse.data.user);
      toast.success('ورود موفقیت آمیز');
      const token = signupResponse.data.data.token;
      const user = signupResponse.data.data.user;
      afterAuth({ user, token });

      setChanges((prev) => ({
        ...prev,
        authStatus: 'success',
        userInfo: signupResponse.data,
      }));

      // Reset form
      reset();

      // Handle success or redirect
    } catch (error) {
      console.log(error);
      setError('An error occurred. Please try again.');
      toast.error('trace code #2 خطا');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpCodeForSignup = async () => {
    setLoading(true);
    try {
      await API.post('/auth/otp-pass', {
        userType: 'customer',
        login: false,
        signup: true,
        user: {
          phone: changes.phoneNumber,
        },
      });
      toast.success('ارسال شد');
    } catch (err) {
      toast.error('خطا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'login-container'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
        }}>
        <Box display="flex" justifyContent={'space-between'}>

          <TextField
            type="tel"
            className={'signup-field'}
            label={t('phone number')}
            variant="standard"
            {...register('phone', { required: true })}
            disabled
          />
        </Box>

        <Box display="flex" justifyContent={'space-between'}>
          <TextField
            type="text"
            className={'signup-field'}

            label={t('first name')}
            variant="standard"
            {...register('firstName', { required: true })}
            error={!!errors.firstName}
            helperText={errors.firstName ? 'First Name is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <TextField
            type="text"
            className={'signup-field'}

            label={t('last name')}
            variant="standard"
            {...register('lastName', { required: true })}
            error={!!errors.lastName}
            helperText={errors.lastName ? 'Last Name is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <TextField
            type="password"
            className={'signup-field ltr-value'}

            label={t('password')}
            variant="standard"
            {...register('password', { required: true })}
            error={!!errors.password}
            helperText={errors.password ? 'Password is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <TextField
            type="password"
            className={'signup-field ltr-value'}

            label={t('confirm password')}
            variant="standard"
            {...register('confirmPassword', { required: true })}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword ? 'Confirm Password is required' : ''
            }
          />
        </Box>

      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
        }}>
        <Box display="flex" justifyContent={'space-between'}>

          <TextField
            sx={{ width: '100%' }}
            type="text"
            label={t('one time password')}
            variant="standard"
            value={changes.activationCode}
            onChange={(e) =>
              setChanges((prev) => ({
                ...prev,
                activationCode: e.target.value,
              }))
            }
            // error={!!errors.firstName}
            // helperText={errors.firstName ? 'First Name is required' : ''}
          />
          <Button
            onClick={handleOtpCodeForSignup}
            disabled={loading}
            variant="contained"
            color="info"
            sx={{ fontWeight: 800 }}
          >
            دریافت کد
          </Button>
        </Box>

        <Button
          type="submit"
          disabled={loading}
          variant="outlined"
          sx={{ fontWeight: 700 }}
          color="success">
          ثبت نام
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
      {error && <p>{error}</p>}
    </form>
  );
}
