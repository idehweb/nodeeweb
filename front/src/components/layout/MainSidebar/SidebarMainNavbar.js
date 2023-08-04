import React from 'react';
import { Navbar, NavbarBrand } from 'shards-react';
import { withTranslation } from 'react-i18next';

import { toggleSidebar } from '#c/functions/index';
import { useSelector } from 'react-redux';

import {logoImg} from '#c/assets/index';


function SidebarMainNavbar({ t, hideLogoText = false }) {
  const menu = useSelector((st) => !!st.store.menuVisible);

  const handleToggleSidebar = () => toggleSidebar(menu);

  return (
    <div className="main-navbar">
      <Navbar
        className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0"
        type="light">
        <NavbarBrand
          className="w-100 mr-0"
          href="#"
          style={{ lineHeight: '25px' }}>
          <div className="d-table m-auto oiuytrt tm-ksa-logo-parent1">
            {/*<img style={{ maxWidth: 58 }} src={logoImg} alt="logo" />*/}
            {/*{!hideLogoText && (*/}
              {/*<span className=" d-md-inline ml-1 gfds">فروشگاه آروند</span>*/}
            {/*)}*/}
            <span className=" d-md-inline ml-1">دسته بندی محصولات</span>

          </div>
        </NavbarBrand>
        {/* eslint-disable-next-line */}
        <div
          className="toggle-sidebar d-sm-inline"
          onClick={handleToggleSidebar}>
          <i className="material-icons">navigate_next</i>
        </div>
      </Navbar>
    </div>
  );
}

export default withTranslation()(SidebarMainNavbar);
