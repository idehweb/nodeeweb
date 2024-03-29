import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'shards-react';
import { withTranslation } from 'react-i18next';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';

import PageTitle from '#c/components/common/PageTitle';
import LoginForm from '#c/components/components-overview/NewLoginForm';
import AuthPortal from '@/components/components-overview/AuthProtocol/index';
import { SaveData } from '../functions/index';
import { getToken } from '../functions/utils';
import { jwtHandler } from '#c/functions/auth';
import Loading from '../components/Loading';

function useDetectRedirect() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  let redirect = params._state || searchParams.get('redirect') || '/profile';
  if (!redirect.startsWith('/')) redirect = '/' + redirect;
  // eslint-disable-next-line no-restricted-globals
  return `${redirect}?from=${encodeURIComponent(location.pathname)}`;
}

const Status = {
  NeedToCheck: 'need-to-check',
  Authenticated: 'authenticated',
  NeedAuth: 'need-auth',
};

const Login = ({ t }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = useDetectRedirect();
  const [status, setStatus] = useState(
    searchParams.get('check') === 'false' ? Status.NeedAuth : Status.NeedToCheck
  );

  const check = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return setStatus(Status.NeedAuth);

      const user = await jwtHandler.login();
      SaveData({ user });
      setStatus(Status.Authenticated);
    } catch (err) {
      console.error(err);
      return setStatus(Status.NeedAuth);
    }
  }, []);

  useEffect(() => {
    if (status === Status.NeedToCheck) check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === Status.Authenticated) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={t('login / register')}
          subtitle={t('user account')}
          className="text-sm-left"
        />
      </Row>

      <div className="w-100">
        <Col lg="4" className="mx-auto mb-4">
          <Card small>
            {status === Status.NeedToCheck ? (
              <Loading />
            ) : status === Status.NeedAuth ? (
              <AuthPortal redirectTo={redirectTo} />
            ) : null}
          </Card>
        </Col>
      </div>
    </Container>
  );
};

export default withTranslation()(Login);
