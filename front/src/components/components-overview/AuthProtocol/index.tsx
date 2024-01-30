import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Box, Input, MenuItem, Select } from '@mui/material';

import { Navigate } from 'react-router-dom';

import Captcha from '#c/components/captcha';
import styles from '@/assets/styles/Login.module.css';
import API from '@/functions/API';

import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import OtpCodePortal from './OtpCodePortal';
import ForgotPasswordForm from './ForgotPasswordForm';
// import ForgotPasswordForm from './ForgotPasswordForm';

export interface otpResponseDataProps {
  data: {
    userExists: boolean;
    leftTime: { milliseconds: number; seconds: number };
  };
}

export interface userInfoProps {
  token: string;
  user?: {
    phone?: string;
    phoneNumber?: string;
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    // password: string;
    username: string;
    source: string;
    type: string;
    customerGroup: unknown[];
    whatsapp: boolean;
    credit: number;
    score: number;
    role: string;
    active: boolean;
    contacts: unknown[];
    wishlist: unknown[];
    notificationTokens: unknown[];
    invitation_list: unknown[];
    status: unknown[];
    photos: unknown[];
    address: unknown[];
    createdAt: string;
    updatedAt: string;
    _V: number;
  };
}

export interface UserProps {
  authStatus:
    | 'detect'
    | 'success'
    | 'login'
    | 'signup'
    | 'change-password:active'
    | 'change-password';
  captcha: boolean;
  countryCode?: string;
  phoneNumber?: string;
  activationCode?: string;
  tempPassword?: string;
  timer?: number;
  userInfo?: userInfoProps;
  authenticatingProtocol: 'otp' | 'password';
}

export default function AuthPortal(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [userAuthenticationInfo, setUserAuthenticationInfo] =
    useState<UserProps>({
      authStatus: 'detect',
      authenticatingProtocol: 'otp',
      captcha: false,
      // countryCode: '98',
    });
  const { register, handleSubmit } = useForm();
  // const [otpData, setOtpData] = useState<otpResponseDataProps>();

  // Remove unused variables
  const detectUserState = async (event) => {
    if (!userAuthenticationInfo.captcha) {
      toast.error('Wrong Captcha!');
    } else {
      if (
        !userAuthenticationInfo.phoneNumber ||
        userAuthenticationInfo.phoneNumber.trim() === '' ||
        userAuthenticationInfo.phoneNumber === '0'
      ) {
        toast.error('Phone Number Field is Empty');
      } else {
        try {
          setLoading(true);

          const response = await API.post('/auth/otp-pass', {
            userType: 'customer',
            login: false,
            signup: false,
            user: {
              phone: userAuthenticationInfo.phoneNumber,
            },
          });
          if (
            response.data.data.userExists &&
            response.data.data.isPasswordSet &&
            response.data.data.isPhoneSet
          ) {
            setUserAuthenticationInfo((prevState) => ({
              ...prevState,
              authStatus: 'login',
            }));
          }
          if (
            response.data.data.userExists &&
            !response.data.data.isPasswordSet &&
            response.data.data.isPhoneSet
          ) {
            const sendOtpToken = await API.post('/auth/otp-pass', {
              userType: 'customer',
              login: true,
              signup: false,
              user: {
                phone: userAuthenticationInfo.phoneNumber,
              },
            });
            // setOtpData(sendOtpToken.data);
            console.log('send otp to login traceback #iap1 ', sendOtpToken);
            setUserAuthenticationInfo((prevState) => ({
              ...prevState,
              authStatus: 'change-password',
            }));
          } else if (
            !response.data.data.userExists &&
            !response.data.data.isPasswordSet &&
            !response.data.data.isPhoneSet
          ) {
            const sendOtpToken = await API.post('/auth/otp-pass', {
              userType: 'customer',
              login: false,
              signup: true,
              user: {
                phone: userAuthenticationInfo.phoneNumber,
              },
            });
            console.log(
              'send otp for signup traceback #index-auth-portal-l-158 ',
              sendOtpToken
            );
            // setOtpData(sendOtpToken.data);
            setUserAuthenticationInfo((prevState) => ({
              ...prevState,
              authStatus: 'signup',
            }));
          }
          setLoading(true);
        } catch (err: any) {
          toast.error('خطا');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  function captchaAction(e: boolean) {
    if (e) {
      // Set user captcha pass to true
      setUserAuthenticationInfo((prevState) => ({
        ...prevState,
        captcha: true,
      }));
    }
  }

  const countryCodes = [
    { value: '98', label: 'IR ( +98 )' },
    // { value: '33', label: 'IDK ( +33 )' },
  ];

  // if (JSON.parse(localStorage.getItem('user'))) navigate('/profile');

  return userAuthenticationInfo.authStatus === 'detect' ? (
    <div>
      <form
        onSubmit={handleSubmit(detectUserState)}
        className={`${styles.container} form-group ltr`}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
          className={styles.formPhoneFieldContainer}>
          {countryCodes.length === 1 ? (
            <Input
              sx={{ textAlign: 'center' }}
              type="text"
              defaultValue={countryCodes[0].label}
              disabled
              style={{ width: '25%' }}
            />
          ) : (
            <Select
              style={{ minWidth: '25%' }}
              id="countryCode"
              // type="text"
              value={
                userAuthenticationInfo.countryCode || countryCodes[0].value
              }
              onChange={(event) => {
                console.log('tracecode #ia-l-222', event.target.value);
                setUserAuthenticationInfo((prevState) => ({
                  ...prevState,
                  countryCode: event.target.value as string,
                }));
              }}
              required // Add required attribute
            >
              {countryCodes.map((country) => (
                <MenuItem
                  key={country.value}
                  value={country.value}
                  style={{ textAlign: 'center' }}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          )}

          <Input
            sx={{ direction: 'rtl' }}
            type="tel"
            id="phoneNumber"
            name="شماره تماس"
            placeholder="شماره تماس"
            {...register('phoneNumber', {
              required: true,
              minLength: 10,
            })}
            value={userAuthenticationInfo.phoneNumber}
            onChange={(event) =>
              setUserAuthenticationInfo((prevState) => ({
                ...prevState,
                phoneNumber: event.target.value,
              }))
            }
            required // Add required attribute
          />
        </Box>
        <>
          <p>{t('enter captcha')}</p>
          <Captcha onActionSubmit={captchaAction} />
        </>
        <button disabled={loading} type="submit" className={styles.button}>
          {t('get enter code')}
        </button>
      </form>
    </div>
  ) : userAuthenticationInfo.authStatus === 'signup' ? (
    <SignupForm
      changes={userAuthenticationInfo}
      setChanges={setUserAuthenticationInfo}
    />
  ) : userAuthenticationInfo.authStatus === 'change-password:active' ? (
    <OtpCodePortal
      timer={userAuthenticationInfo.timer || 120}
      changes={userAuthenticationInfo}
      setChanges={setUserAuthenticationInfo}
    />
  ) : userAuthenticationInfo.authStatus === 'login' ? (
    <SigninForm
      changes={userAuthenticationInfo}
      setChanges={setUserAuthenticationInfo}
    />
  ) : userAuthenticationInfo.authStatus === 'success' ? (
    <Navigate to={'/'} replace />
  ) : userAuthenticationInfo.authStatus === 'change-password' ? (
    <ForgotPasswordForm
      changes={userAuthenticationInfo}
      setChanges={setUserAuthenticationInfo}
    />
  ) : (
    <div>unexpected error</div>
  );
}
