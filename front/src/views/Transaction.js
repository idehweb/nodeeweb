import React, { useEffect, useState } from 'react';
import { Button, Container } from 'shards-react';
import { useTranslation, withTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { updateTransactionStatus } from '../functions/index';
// import Loading from "#c/components/Loading";
import LoadingComponent from '#c/components/components-overview/LoadingComponent';

const Status = {
  Paid: '1',
  CheckBefore: '2',
  Failed: '-1',
};

function Transaction(props) {
  const [theload, setTheLoad] = useState(true);
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const status = params.get('status') ?? Status.Failed;
  const orderId = params.get('order_id');

  let msg = '';
  switch (status) {
    case Status.Paid:
      msg = t('Transaction was successful!');
      break;
    case Status.CheckBefore:
      msg = t('Transaction was checked before!');
      break;
    case Status.Failed:
    default:
      msg = t('Transaction was unsuccessful!');
      break;
  }

  const Loading = (
    <div className="loadNotFound loader " key={23}>
      {t('loading...')}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070" />
    </div>
  );
  // return Loading;
  return (
    <Container fluid className="main-content-container px-4 pb-4">
      <div className="error">
        <div className="error__content">
          {!theload && <>{Loading}</>}
          {theload && (
            <div>
              {orderId && <h2>{t('order number') + ':' + orderId}</h2>}
              <h3>{msg}</h3>
              <p></p>
              <Link to={'/'}>
                <Button pill>&larr; {t('Go Back')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default withTranslation()(Transaction);
