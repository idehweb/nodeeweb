import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Box, Input, Select } from '@mui/material';

import { Navigate } from 'react-router-dom';

import Captcha from '#c/components/captcha';
import styles from '@/assets/styles/Login.module.css';
import API from '@/functions/API';

import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import OtpCodePortal from './OtpCodePortal';
import ForgotPasswordForm from './ForgotPasswordForm';

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
    | 'signup:active'
    | 'change-password';
  captcha: boolean;
  countryCode?: string;
  phoneNumber?: string;
  activationCode?: string;
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
    });
  const { register, handleSubmit } = useForm();
  const [otpData, setOtpData] = useState<otpResponseDataProps>();

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

          const response = await API.post('/auth/otp', {
            userType: 'customer',
            login: false,
            signup: false,
            user: {
              phone:
                userAuthenticationInfo.countryCode +
                userAuthenticationInfo.phoneNumber.replace(/^0/, ''),
            },
          });
          if (response.data.data.userExists) {
            setUserAuthenticationInfo((prevState) => ({
              ...prevState,
              authStatus: 'login',
            }));
          } else {
            const sendOtpToken = await API.post('/auth/otp', {
              userType: 'customer',
              login: false,
              signup: true,
              user: {
                phone:
                  userAuthenticationInfo.countryCode +
                  userAuthenticationInfo.phoneNumber.replace(/^0/, ''),
              },
            });
            setOtpData(sendOtpToken.data);
            setUserAuthenticationInfo((prevState) => ({
              ...prevState,
              authStatus: 'signup:active',
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

  // if (JSON.parse(localStorage.getItem('user'))) navigate('/profile');

  return userAuthenticationInfo.authStatus === 'detect' ? (
    <div>
      <form
        onSubmit={handleSubmit(detectUserState)}
        className={`${styles.container} form-group ltr`}>
        <Box
          sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          className={styles.formPhoneFieldContainer}>
          <label
            className="center my-2"
            style={{ textAlign: 'center' }}
            htmlFor="countryCode">
            {t('country-code')}
          </label>

          <Select
            id="countryCode"
            value={userAuthenticationInfo.countryCode}
            onChange={(event) =>
              setUserAuthenticationInfo((prevState) => ({
                ...prevState,
                countryCode: event.target.value,
              }))
            }
            required // Add required attribute
          >
            {[{ value: '98', label: 'IR ( +98 )' }].map((country) => (
              <option
                key={country.value}
                value={country.value}
                style={{ textAlign: 'center' }}>
                {country.label}
              </option>
            ))}
          </Select>
          <label
            className="my-2"
            style={{ textAlign: 'center' }}
            htmlFor="phoneNumber">
            {t('phone number')}
          </label>

          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
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
  ) : userAuthenticationInfo.authStatus === 'signup:active' ? (
    <OtpCodePortal
      timer={otpData.data.leftTime.seconds}
      changes={userAuthenticationInfo}
      setChanges={setUserAuthenticationInfo}
    />
  ) : userAuthenticationInfo.authStatus === 'signup' ? (
    <SignupForm
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
