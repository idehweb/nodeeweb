import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';

import useFetch from '@/hooks/useFetch';
import { dateFormat } from '@/functions/utils';
import Loading from '../Loading';

export interface TransactionProps {
  __v: number;
  _id: string;
  active: boolean;
  amount: number;
  authority: string;
  createdAt: string;
  creator_category: string;
  currency: string;
  expiredAt: string;
  order: string;
  payer: {
    _id: string;
    type: string;
  };
  payment_link: string;
  payment_method: string;
  payment_body?: { RefId: string };
  provider: string;
  status: string;
  updatedAt: string;
}

export default function UserTransactions() {
  const { data, isLoading, error } = useFetch({
    requestQuery: '/transaction?active=false&active=true',
  });
  const navigate = useNavigate();
  const [sendPaymentRequest, setSendPaymentRequest] = useState(false);
  const [choosenTransaction, setChoosenTransaction] =
    useState<TransactionProps>();
  const handlePaymentRequest = (choosedTx: TransactionProps) => {
    if (choosedTx.payment_method === 'get') {
      // const isExternalLink = /^https?:\/\//i.test(choosedTx.payment_link);
      try {
        const url = new URL(choosedTx.payment_link);
        window.location.href = url.href;
      } catch (error) {
        navigate(choosedTx.payment_link);
      }
    } else {
      setChoosenTransaction(choosedTx);
      setSendPaymentRequest(true);
    }
  };
  const TransactionsList = (data as { data: TransactionProps[] }).data || [];
  const TransactionCard = ({
    transaction,
  }: {
    transaction: TransactionProps;
  }) => (
    <Card key={transaction._id} sx={{ marginY: '1rem' }}>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
          <Typography variant="h5" component="h2" textAlign="center">
            اطلاعات تراکنش :
          </Typography>
          <Typography variant="body1" component="p">
            {transaction._id}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" component="p">
            کد رهگیری سفارش :
          </Typography>
          <Typography variant="body1" component="p">
            {transaction.order}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" component="p">
            مقدار قابل پرداخت :
          </Typography>
          <Typography variant="body1" component="p">
            {transaction.amount.toLocaleString()}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" component="p">
            درگاه انتخابی :
          </Typography>
          <Typography variant="body1" component="p">
            {transaction.provider}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" component="p">
            وضیعت پرداخت :
          </Typography>
          <Typography variant="body1" component="p">
            {transaction.status}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" component="p">
            تاریخ ایجاد :
          </Typography>
          <Typography variant="body1" component="p">
            {dateFormat(transaction.createdAt)}
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            onClick={() => {
              handlePaymentRequest(transaction);
            }}
            disabled={transaction.status === 'need-to-pay' ? false : true}
            variant="contained"
            sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
            {transaction.status === 'need-to-pay' ? 'پرداخت' : 'پرداخت شده'}
          </Button>
          <Link to={`/order-details/${transaction.order}`}>
            <Button
              variant="contained"
              sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
              نمایش سفارش
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );

  const formRef = useRef(null);

  useEffect(() => {
    if (sendPaymentRequest) {
      formRef.current.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendPaymentRequest]);

  return sendPaymentRequest ? (
    <>
      <form
        ref={formRef}
        // onSubmit={onCreateTransaction}
        method={choosenTransaction.payment_method}
        name="formBank"
        id="formBank"
        action={choosenTransaction.payment_link}>
        <input
          type="hidden"
          value={choosenTransaction.payment_body.RefId}
          id="RefId"
          name="RefId"
        />
        <div>در حال انتقال به درگاه بانک ملت ...</div>
        <input type="submit" value="پرداخت" />
      </form>
    </>
  ) : (
    <div style={{ minHeight: '47vh' }}>
      {isLoading ? (
        <Loading loadingClass={''} />
      ) : error ? (
        <div>خطا</div>
      ) : (
        TransactionsList.length > 0 && (
          <div>
            {TransactionsList.map((_transaction) => (
              <TransactionCard transaction={_transaction} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
