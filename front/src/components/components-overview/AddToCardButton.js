import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'shards-react';
import { withTranslation } from 'react-i18next';

import { dFormat, PriceFormat } from '#c/functions/utils';
import { addItem, MainUrl, removeItem } from '#c/functions/index';
import { defaultImg } from '#c/assets/index';
import { store } from '#c/functions/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { toggleCardbar } from '#c/functions/index';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import API from '@/functions/API';
import { CartService } from '@/functions/order/cart';
function AddToCardButton({
  item,
  text = '',
  variable = false,
  children,
  t,
  product,
}) {
  const [count, setCount] = useState(0);
  let [Navigate, SetNavigate] = useState(null);
  let card = useSelector((st) => st.store.card || []);
  let history = useNavigate();

  function getCombination() {
    return product.combinations[0];
  }
  const onCreate = useCallback(
    async (e) => {
      try {
        const comb = getCombination();
        await CartService.create({ ...product, combinations: [comb] });
        toggleCardbar();
        toast.success(t('Added to cart successfully!'));
      } catch (err) {
        toast.error(t('Can not add to cart'));
      }
    },
    [product.id, getCombination, toggleCardbar],
  );
  const onIncrease = useCallback(async (e) => {
    // if (text && text === t('options') && !item.single) {
    //   let title = encodeURIComponent(item.title.fa.replace(/\\|\//g, ''));
    //   history('/product/' + item._id + '/' + title);
    // }
    try {
      const comb = getCombination();
      comb.quantity = count + 1;
      await CartService.update({ ...product, combinations: [comb] });
      setCount(count + 1);
      toggleCardbar();
      toast.success(t('Added to cart successfully!'));
    } catch (err) {
      toast.error(t('Can not add to cart'));
    }
  }, []);
  const onDecrease = useCallback((e) => {}, []);

  const refreshCard = () => {};
  if (Navigate) {
    return <Navigate to={Navigate} />;
  }
  if ((item.single && !item.in_stock) || (item.single && !item.quantity)) {
    return (
      <div className={'outOfStock ' + item.type}>
        <CloseIcon />
        {t('out of stock')}
      </div>
    );
  }
  if (item.type === 'normal') {
    if (item.quantity === 0 || !item.in_stock)
      return (
        <div className={'outOfStock ' + item.type}>
          <CloseIcon />
          {t('out of stock')}
        </div>
      );
  }

  let mojud = false;
  if (variable && !item.single) {
    if (item.combinations) {
      item.combinations.map((com) => {
        if (com.in_stock) {
          mojud = true;
        }
      });
    }
    if (!mojud) {
      return (
        <div className={'outOfStock variablestock'}>
          <CloseIcon />
          {t('out of stock')}
        </div>
      );
    }
  }

  return (
    <div className="AddToCardButton">
      {count !== 0 && (
        <Button size="md" className={'buy-button kjhgfgh'} theme="primary">
          <RemoveCircleOutlineIcon className={'left'} onClick={onDecrease} />
          {count}
          <AddCircleOutlineIcon className={''} onClick={onIncrease} />
        </Button>
      )}
      {count === 0 && (
        <Button
          size="md"
          className={'buy-button kjhgfgh empty-card '}
          theme="primary"
          onClick={onCreate}>
          {!item.single && <span>{text}</span>}
          {!item.single && <ShoppingBagIcon className="center" />}
          {!variable && <span>{t('add to cart')}</span>}
        </Button>
      )}
      {children}
    </div>
  );
}

export default withTranslation()(AddToCardButton);
