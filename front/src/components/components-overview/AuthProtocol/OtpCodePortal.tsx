import { CircularProgress, Input, Button, Box } from '@mui/material';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { UserProps } from '.';
import API from '@/functions/API';
import { afterAuth } from './utils';

export default function OtpCodePortal({
  timer,
  setChanges,
  changes,
}: {
  timer: number;
  setChanges: Dispatch<SetStateAction<UserProps>>;
  changes: UserProps;
}) {
  const [intervalTimer, setIntervalTimer] = useState<number>(timer);
  const handleClearInterval = () => {
    clearInterval(timer);
    return 0;
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalTimer((prevTimer) =>
        prevTimer > 0 ? prevTimer - 1 : handleClearInterval()
      );
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    try {
      const signinResponse = await API.post('/auth/otp-pass/login', {
        userType: 'customer',
        user: {
          phone: changes.phoneNumber,
          code: changes.activationCode,
        },
      });
      console.log('otpcodeportal tracecod #12 ', signinResponse);
      setLoading(true);
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
    } catch (err) {
      toast.error('خطا در ورود با حساب کاربری');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '3rem',
        padding: '2rem',
        minHeight: '50vh',
      }}>
      <div className={'your-timer'}>
        <div className={'flex-item '}>
          <Box display={'flex'} justifyContent={'space-between'} gap={'3rem'}>
            <p>شماره موبایل شما:</p>
            <p className="ltr">{changes.phoneNumber}</p>
          </Box>
          {Boolean(timer) ? (
            <div className={'flex-item-relative center '}>
              <CircularProgress
                className={'red-progress'}
                thickness={2}
                size={60}
                variant="determinate"
                value={(intervalTimer * 100) / 120}
              />
              <div className={'flex-item-absolute '}>{intervalTimer}</div>
            </div>
          ) : (
            <div>زمان به پایان رسید</div>
          )}
        </div>
      </div>
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
          }}>
          <label style={{ fontSize: 12 }} htmlFor="otpCode">
            کد ارسال شده را وارد نمایید
          </label>
        </div>
        <Input
          sx={{ marginY: '1rem' }}
          type="number"
          id="otpCode"
          name="OTP Code"
          placeholder="OTP"
          value={changes.activationCode}
          onChange={(event) =>
            setChanges((prevState) => ({
              ...prevState,
              activationCode: event.target.value,
            }))
          }
          required
        />
      </>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <Button
          onClick={() => {
            handleClearInterval();
            onSubmit();
          }}
          variant="outlined"
          color="success"
          disabled={loading}
          fullWidth>
          ثبت
        </Button>
        <Button
          disabled={loading}
          onClick={() => {
            handleClearInterval();
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

      {intervalTimer === 0 && (
        <Button
          disabled={loading}
          variant="contained"
          color="inherit"
          fullWidth>
          ارسال مجدد کد؟
        </Button>
      )}
    </Box>
  );
}
