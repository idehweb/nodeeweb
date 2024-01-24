import { CircularProgress, Input, Button, Box } from '@mui/material';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { UserProps } from '.';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalTimer((prevTimer) =>
        prevTimer > 0 ? prevTimer - 1 : handleClearInterval()
      );
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            <p className="ltr">
              {changes.countryCode.replace(/\+/g, '') +
                changes.phoneNumber.replace(/^0/, '')}
            </p>
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
            setChanges((prev) => ({
              ...prev,
              authStatus: 'signup',
            }));
          }}
          variant="outlined"
          color="success"
          fullWidth>
          ثبت
        </Button>
        <Button
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
        <Button variant="contained" color="inherit" fullWidth>
          ارسال مجدد کد؟
        </Button>
      )}
    </Box>
  );
}
