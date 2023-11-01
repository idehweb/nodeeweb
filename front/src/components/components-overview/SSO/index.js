import store from '@/functions/store';
import { SaveData } from '@/functions';

import { Row, Container, HR } from './components';
import Google from './Google';

export default function SSO({ setLoading, onNext }) {
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

  return (
    <Container>
      <HR>
        <span>Or</span>
      </HR>
      <Row>
        <Google setLoading={setLoading} onSuccess={handleSuccess} />
      </Row>
    </Container>
  );
}
