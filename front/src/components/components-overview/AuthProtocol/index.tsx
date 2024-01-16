import {
  Button,
  FormInput,
  FormSelect,
  InputGroup,
  InputGroupAddon,
} from 'shards-react';

import { useTranslation } from 'react-i18next';

import { useState } from 'react';

import { useForm } from 'react-hook-form';

import Captcha from '#c/components/captcha';

import styles from '@/assets/styles/Login.module.css';

import { captchaAction, detectUserState } from './utils';

export interface UserProps {
  authStatus:
    | 'detect'
    | 'success'
    | 'login:active'
    | 'signup:active'
    | 'signuo';
  captcha: boolean;
  phoneNumber: string;
  activationCode: string;
  firstName: string;
  lastName: string;
  authenticatingProtocol: 'otp' | 'password';
}

export default function AuthPortal() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [userAuthenticationInfo, setUserAuthenticationInfo] =
    useState<UserProps>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return loading ? (
    <></>
  ) : (
    <div>
      <form
        onSubmit={handleSubmit(detectUserState)}
        className={`${styles.container} form-group ltr`}>
        <label htmlFor="thepho">{t('phone number')}</label>

        <InputGroup className="mb-3">
          <InputGroupAddon type="prepend">
            <FormSelect>
              <option value="98">+98</option>
            </FormSelect>
          </InputGroupAddon>
          <FormInput
            placeholder="**********"
            id="thepho"
            className={'iuygfghuji'}
            type="tel"
            dir="ltr"
          />
        </InputGroup>
        <>
          <p>{t('enter captcha')}</p>
          <Captcha onActionSubmit={captchaAction} />
        </>
        <Button
          block
          // type="submit"
          className="center"
          onClick={(value) => console.log(value)}>
          {t('get enter code')}
        </Button>
      </form>
    </div>
  );
}
