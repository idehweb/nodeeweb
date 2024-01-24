import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

import { toast } from 'react-toastify';

import API from '@/functions/API';

import { afterAuth } from './utils';

import { UserProps } from '.';

export default function SigninForm({
  setChanges,
  changes,
}: {
  setChanges: Dispatch<SetStateAction<UserProps>>;
  changes: UserProps;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      username: changes.countryCode + changes.phoneNumber.replace(/^0/, ''),
      password: null,
    },
  });

  const onSubmit = async (e) => {
    try {
      setLoading(true);
      // Make API call
      const signinResponse = await API.post('/auth/user-pass/login', {
        userType: 'customer',
        user: {
          username: changes.countryCode + changes.phoneNumber.replace(/^0/, ''),
          password: e.password,
        },
      });
      // Reset form

      localStorage.setItem('user', signinResponse.data.data.user);
      toast.success('ورود موفقیت آمیز');
      console.log('sign in respones is -----> ', signinResponse.data.data);
      const token = signinResponse.data.data.token;
      const user = signinResponse.data.data.user;
      afterAuth({
        user,
        token,
      });

      setChanges((prev) => ({
        ...prev,
        authStatus: 'success',
        userInfo: signinResponse.data.data,
      }));

      // Save authToken to cookie
      // document.cookie = `authToken=${signinResponse.data.data.token}`;

      reset();

      // Handle success or redirect
    } catch (error) {
      console.log('trace code #1', error);
      toast.error('trace code #1 خطا');
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'2rem'}
        padding={'2rem'}>
        <TextField
          name="username"
          label="Username"
          defaultValue={
            changes.countryCode + changes.phoneNumber.replace(/^0/, '')
          }
          disabled
        />
        <TextField
          {...register('password', { required: true })}
          name="password"
          label="Password"
          type="text"
        />
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          sx={{ fontWeight: 700, fontSize: '1rem' }}
          color="success">
          ورود
        </Button>
        {error && <p>{error}</p>}
      </Box>
    </form>
  );
}
