import { useState, useEffect } from 'react';

import store from '@/functions/store';
import { SaveData } from '@/functions';

import Loading from '@/components/Loading';

import { Row, Container, HR } from './components';
import Google from './Google';
import { isGoogleReady, makeGoogleReady } from './Google/utils';

export default function SSO({ setLoading, onNext }) {
  const [googleState, setGoogleState] = useState('none');

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
            <Google setLoading={setLoading} onSuccess={onNext} />
          </Row>
        </>
      ) : null}
    </Container>
  );
}
