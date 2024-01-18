import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { FormControl, Input, Select } from '@mui/material';

import Captcha from '#c/components/captcha';
import styles from '@/assets/styles/Login.module.css';

export interface UserProps {
  authStatus:
    | 'detect'
    | 'success'
    | 'login:active'
    | 'signup:active'
    | 'signup';
  captcha?: boolean;
  countryCode?: string;
  phoneNumber?: string;
  activationCode?: string;
  firstName?: string;
  lastName?: string;
  authenticatingProtocol: 'otp' | 'password';
}

export default function AuthPortal() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [userAuthenticationInfo, setUserAuthenticationInfo] =
    useState<UserProps>({
      authStatus: 'detect',
      authenticatingProtocol: 'otp',
    });
  const { register } = useForm(); // Remove unused variables

  async function detectUserState(event) {
    console.log('event data is : ', event);
    if (!userAuthenticationInfo.captcha) {
      toast.error('Wrong Captcha!');
    } else {
      if (
        !userAuthenticationInfo.phoneNumber ||
        userAuthenticationInfo.phoneNumber.trim() === '' ||
        userAuthenticationInfo.phoneNumber === '0'
      ) {
        toast.error('Phone Number Field is Empty');
      }
    }
  }

  function captchaAction(e: boolean) {
    if (e) {
      // Set user captcha pass to true
      setUserAuthenticationInfo((prevState) => ({
        ...prevState,
        captcha: true,
      }));
    }
  }

  return loading ? (
    <></>
  ) : (
    <div>
      <form
        onSubmit={(values) => detectUserState(values)}
        className={`${styles.container} form-group ltr`}>
        <FormControl
          margin="normal"
          fullWidth
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
            {[{ value: '+98', label: 'IR ( +98 )' }].map((country) => (
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
        </FormControl>

        <>
          <p>{t('enter captcha')}</p>
          <Captcha onActionSubmit={captchaAction} />
        </>
        <button disabled={loading} type="submit" className={styles.button}>
          {t('get enter code')}
        </button>
      </form>
    </div>
  );
}
