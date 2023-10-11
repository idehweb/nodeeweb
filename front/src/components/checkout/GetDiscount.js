import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, FormInput } from 'shards-react';
import { toast } from 'react-toastify';
import { DiscountService } from '@/functions/order/discount';

function GetDiscount({ children, t, setDiscountCode = (e) => {} }) {
  let [dis, setDis] = useState('');
  return (
    <div className="PriceChunker">
      <div className={'s mb-2 posrel'}>
        <FormInput
          size={'sm'}
          id="feFirstName"
          value={dis}
          onChange={(event) => {
            setDis(event.target.value);
          }}
        />

        <Button
          size="sm left"
          className={'set-discount ghvhvghv'}
          left={'true'}
          onClick={(e) => {
            DiscountService.get(dis)
              .then((r) => {
                setDiscountCode(dis);
                toast(t('successfully done!'), {
                  type: 'success',
                });
              })
              .catch((er) => {
                console.log('er', er);
                toast(t(er && er.message ? er.message : 'Code is wrong!'), {
                  type: 'warning',
                });
              });
          }}>
          {t('get discount')}
        </Button>
      </div>
      {children}
    </div>
  );
}

export default withTranslation()(GetDiscount);
