import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

import { UserProps } from '.';
import { toast } from 'react-toastify';
import API from '@/functions/API';

export default function SigninForm({
  setChanges,
  changes,
}: {
  setChanges: Dispatch<SetStateAction<UserProps>>;
  changes: UserProps;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      username: changes.phoneNumber,
      password: '',
    },
  });

  const onSubmit = async (e) => {
    setLoading(true);
    setError('');
    console.log('im called', e);
    try {
      // Make API call
      const singupResponse = await API.post('/auth/user-pass/login', {
        userType: 'customer',
        user: {
          username: changes.phoneNumber,
          password: e.password,
        },
      });
      console.log('Login response is ', singupResponse);
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
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'2rem'}
        padding={'2rem'}>
        <TextField
          name="username"
          label="Username"
          defaultValue={changes.phoneNumber}
          disabled
        />
        <TextField
          {...register('password', { required: true })}
          name="password"
          label="Password"
          type="text"
        />
        <Button type="submit" variant="contained" color="primary">
          Sign In
        </Button>
      </Box>
    </form>
  );
}
