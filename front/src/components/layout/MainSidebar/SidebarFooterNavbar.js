import React from 'react';
import {Navbar, NavbarBrand} from 'shards-react';
import {withTranslation} from 'react-i18next';

import {toggleSidebar} from '#c/functions/index';
import {useSelector} from 'react-redux';

import {logoImg} from '#c/assets/index';
import CloseIcon from '@mui/icons-material/Close';


function SidebarFooterNavbar({t, hideLogoText = false}) {
  const menu = useSelector((st) => !!st.store.menuVisible);

  const handleToggleSidebar = () => toggleSidebar(menu);

  return (

    <Navbar
      className="align-items-stretch bg-white flex-md-nowrap footer-nav-bar p-0"
      type="light">

      <div
        className="toggle-sidebar d-sm-inline"
        onClick={handleToggleSidebar}>
        <CloseIcon/>
      </div>
    </Navbar>

  );
}

export default withTranslation()(SidebarFooterNavbar);
