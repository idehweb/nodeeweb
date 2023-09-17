import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'shards-react';
import { withTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import PageTitle from '#c/components/common/PageTitle';
import LoginForm from '#c/components/components-overview/NewLoginForm';
import { savePost } from '../functions/index';
import { getToken } from '../functions/utils';
import API from '../functions/API';
import { jwtHandler } from '@/functions/auth';

const Status = {
  NeedToCheck: 'need-to-check',
  Authenticated: 'authenticated',
  NeedAuth: 'need-auth',
};

const Login = ({ t }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(
    searchParams.get('noCheck') ? Status.NeedAuth : Status.NeedToCheck,
  );

  let params = useParams();

  if (params._state === 'goToCheckout') {
    savePost({ goToCheckout: true });
  }
  if (params._state === 'goToChat') {
    savePost({ goToChat: true });
  }

  const check = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return setStatus(Status.NeedAuth);

      const { data } = await jwtHandler.login(undefined, { login: true });
    } catch (err) {
      console.error(err);
      return setStatus(Status.NeedAuth);
    }
  }, []);

  useEffect(() => {
    if (status === Status.NeedToCheck) check();
  }, []);

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
            <LoginForm goToCheckout={params._state === 'goToCheckout'} />
          </Card>
        </Col>
      </div>
    </Container>
  );
};

export default withTranslation()(Login);
