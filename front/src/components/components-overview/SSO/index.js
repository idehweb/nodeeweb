import { useState, useEffect } from 'react';

import store from '@/functions/store';
import { SaveData } from '@/functions';

import { Row, Container, HR } from './components';
import Google from './Google';
import { isGoogleReady, makeGoogleReady } from './Google/utils';
import Loading from '@/components/Loading';

export default function SSO({ setLoading, onNext }) {
  const [googleState, setGoogleState] = useState('none');

  const handleSuccess = (res) => {
    let { user } = store.getState().store;

    const {
      token,
      email,
      address,
      firstName,
      lastName,
      invitation_code,
      internationalCode,
      _id,
    } = res;
    let temp = {
      ...user,
      ...{
        token,
        email,
        address,
        firstName,
        lastName,
        invitation_code,
        internationalCode,
        _id,
      },
    };

    SaveData({ user: temp, address: address });
    onNext && onNext(res);
  };

  useEffect(() => {
    if (googleState !== 'none') return;
    (async () => {
      try {
        if (isGoogleReady()) return setGoogleState('ready');

        setGoogleState('loading');
        if (await makeGoogleReady()) setGoogleState('ready');
        else setGoogleState('notReady');
      } catch (err) {
        setGoogleState('notReady');
        console.error(err);
      }
    })();
  }, [googleState]);
  console.log('we are here', googleState);
  return (
    <Container>
      {googleState === 'loading' ? (
        <Loading />
      ) : googleState === 'ready' ? (
        <>
          <HR>
            <span>Or</span>
          </HR>
          <Row>
            <Google setLoading={setLoading} onSuccess={handleSuccess} />
          </Row>
        </>
      ) : null}
    </Container>
  );
}
