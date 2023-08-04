import React from 'react';
import clsx from 'clsx';
import {Col} from 'shards-react';

import SidebarMainNavbar from './SidebarMainNavbar';
import SidebarFooterNavbar from './SidebarFooterNavbar';
import SidebarNavItems from './SidebarNavItems';
import SidebarAttrItems from './SidebarAttrItems';
import {useSelector} from 'react-redux';

export const APP_VERSION = process.env.REACT_APP_VERSION_NUM;

export default function NavbarToggle(props) {
  const menuVisible = useSelector((st) => !!st.store.menuVisible);
  // let [width, height] = useWindowSize();


  const classes = clsx('main-sidebar', 'px-0', 'col-9', menuVisible && 'open');
  return (
    <>
        {menuVisible && <div className={'back-drop'}></div>}
      <Col tag="aside" className={classes} lg={{size: 4}} md={{size: 5}} sm={{size: 5}}>
      {/*<div className="version">Ver: {APP_VERSION}</div>*/}
      {/*<SidebarMainNavbar hideLogoText={props.hideLogoText}/>*/}

      {!props.children && <SidebarNavItems {...props} />}
      {props.children}

      {/*<SidebarAttrItems {...props} />*/}
      <SidebarFooterNavbar hideLogoText={props.hideLogoText}/>
    </Col>
    </>
  );
}
