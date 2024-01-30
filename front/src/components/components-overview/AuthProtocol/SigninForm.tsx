import { Dispatch, SetStateAction, useState } from 'react';
// import { useForm } from 'react-hook-form';
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
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    // console.log('login#23', e);
    try {
      setLoading(true);
      // Make API call
      const signinResponse = await API.post('/auth/otp-pass/login', {
        userType: 'customer',
        user: {
          phone: changes.phoneNumber,
          password: password,
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

      // reset();

      // Handle success or redirect
    } catch (error) {
      console.log('trace code #1', error);
      toast.error('خطا');
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'2rem'}
        padding={'2rem'}>
        <TextField
          name="Phone Number"
          label="شماره موبایل"
          defaultValue={changes.phoneNumber}
          disabled
        />
        <TextField
          // {...register('password', { required: true })}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="رمز عبور"
          type="password"
        />
        <Button
          disabled={loading}
          onClick={onSubmit}
          variant="contained"
          sx={{ fontWeight: 700, fontSize: '1rem' }}
          color="success">
          ورود
        </Button>
        <Button
          disabled={loading}
          onClick={() =>
            setChanges((prevState) => ({
              ...prevState,
              authStatus: 'change-password',
            }))
          }
          variant="contained"
          sx={{ fontWeight: 700, fontSize: '1rem' }}
          color="success">
          فراموشی رمز عبور
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
        {error && <p>{error}</p>}
      </Box>
      {/* </form> */}
    </>
  );
}
