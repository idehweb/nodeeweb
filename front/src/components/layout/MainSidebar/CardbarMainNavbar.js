import React from 'react';
import { Navbar } from 'shards-react';
import { withTranslation } from 'react-i18next';

import { toggleCardbar } from '#c/functions/index';

import { useSelector } from 'react-redux';

import { logoImg } from '#c/assets/index';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { CartService } from '@/functions/order/cart';

function CardbarMainNavbar({ t, hideLogoText = false }) {
  const cardVisible = useSelector((st) => !!st.store.cardVisible);
  const cart = useSelector((st) => st.store.cart);

  const handleToggleCardbar = () => toggleCardbar(cardVisible);
  let count = 0;
  if (cart) {
    count = CartService.getCartLength(cart);
  }
  return (
    <div className="main-navbar">
      <Navbar
        className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0"
        type="light">
        <div className="d-sm-inline ">
          <div className={'jhgfdfg'}>
            <ShoppingBagIcon />
            {count}
            <span className={'ml-1 mr-2'}>{t('item')}</span>
          </div>
        </div>
        {/* eslint-disable-next-line */}
        <div
          className="toggle-sidebar d-sm-inline"
          onClick={handleToggleCardbar}>
          <CloseIcon />
        </div>
      </Navbar>
    </div>
  );
}

export default withTranslation()(CardbarMainNavbar);
