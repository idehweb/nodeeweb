import React, { useCallback, useEffect, useState } from 'react';

import { Button } from 'shards-react';
import { withTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { toggleCardbar } from '#c/functions/index';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { CartService } from '@/functions/order/cart';
function AddToCardButton({
  item,
  text = '',
  variable = false,
  children,
  t,
  product,
  combination,
}) {
  const [count, setCount] = useState(CartService.getQuantity(combination._id));
  let [Navigate, SetNavigate] = useState(null);
  const onCreate = useCallback(
    async (e) => {
      try {
        const canAdd = await CartService.modify(product, {
          ...combination,
          quantity: 1,
        });
        toggleCardbar();
        canAdd && toast.success(t('Added to cart successfully!'));
        setCount(1);
      } catch (err) {
        toast.error(t('Can not add to cart'));
        console.log(err);
      }
    },
    [product, combination, toggleCardbar]
  );
  const onIncrease = useCallback(
    async (e) => {
      try {
        const canAdd = await CartService.modify(product, {
          ...combination,
          quantity: count + 1,
        });
        setCount(count + 1);
        toggleCardbar();
        canAdd && toast.success(t('Added to cart successfully!'));
      } catch (err) {
        toast.error(t('Can not add to cart'));
      }
    },
    [product, combination, count]
  );
  const onDecrease = useCallback(
    async (e) => {
      try {
        if (count === 1) {
          // delete
          await CartService.delete(product._id, combination._id);
        } else {
          // modify
          await CartService.modify(product, {
            ...combination,
            quantity: count - 1,
          });
        }
        setCount(count - 1);
      } catch (err) {
        toast.error(t('Can not delete from cart'));
      }
    },
    [product, combination, count]
  );

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
