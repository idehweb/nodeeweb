import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, TextField } from '@mui/material';

import { toast } from 'react-toastify';

import API from '@/functions/API';

import { UserProps } from '.';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string; // Added email field
  username: string;
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
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: changes.phoneNumber,
      username: '',
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (e: FormData) => {
    if (e.confirmPassword !== e.password) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    setError('');
    console.log('im called', e);
    try {
      // Make API call
      const singupResponse = await API.post('/auth/user-pass/signup', {
        userType: 'customer',
        user: {
          username:
            changes.countryCode.replace(/\+/g, '') + changes.phoneNumber,
          phone: changes.countryCode.replace(/\+/g, '') + changes.phoneNumber,
          password: e.password,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
        },
      });
      console.log('singupResponse is ', singupResponse);
      // Reset form
      reset();

      // Handle success or redirect
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}>
        <Box display="flex" justifyContent={'space-between'}>
          <label
            className="center my-2"
            style={{ textAlign: 'center', width: '30%' }}
            htmlFor="phone">
            شماره همراه
          </label>
          <TextField
            type="tel"
            {...register('phone', { required: true })}
            disabled
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <label
            className="center my-2"
            style={{ textAlign: 'center', width: '30%' }}
            htmlFor="email">
            ایمیل
          </label>
          <TextField
            type="email"
            {...register('email', { required: true })}
            error={!!errors.email}
            helperText={errors.email ? 'Email is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <label
            className="center my-2"
            style={{ textAlign: 'center', width: '30%' }}
            htmlFor="email">
            نام
          </label>

          <TextField
            type="text"
            {...register('firstName', { required: true })}
            error={!!errors.firstName}
            helperText={errors.firstName ? 'First Name is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <label
            className="center my-2"
            style={{ textAlign: 'center', width: '30%' }}
            htmlFor="email">
            نام خانوادگی
          </label>
          <TextField
            type="text"
            {...register('lastName', { required: true })}
            error={!!errors.lastName}
            helperText={errors.lastName ? 'Last Name is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <label
            className="center my-2"
            style={{ textAlign: 'center', width: '30%' }}
            htmlFor="email">
            رمز عبور
          </label>
          <TextField
            type="password"
            {...register('password', { required: true })}
            error={!!errors.password}
            helperText={errors.password ? 'Password is required' : ''}
          />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <label
            className="center my-2"
            style={{ textAlign: 'center', width: '30%' }}
            htmlFor="email">
            تکرار رمز عبور
          </label>
          <TextField
            type="password"
            {...register('confirmPassword', { required: true })}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword ? 'Confirm Password is required' : ''
            }
          />
        </Box>
        <Button
          type="submit"
          disabled={loading}
          variant="outlined"
          color="success">
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </FormControl>

      {error && <p>{error}</p>}
    </form>
  );
}
