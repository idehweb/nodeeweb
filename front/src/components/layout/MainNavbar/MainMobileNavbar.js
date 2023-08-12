import React from 'react';
import clsx from 'clsx';
import {Container, Navbar} from 'shards-react';
import NavbarToggle from './NavbarToggle';
import SearchToggle from './SearchToggle';
import NavbarSearch from './NavbarSearch';
import { useSelector } from 'react-redux';

import MainCats from './NavbarNav/MainCats';
import {logoImg} from '#c/assets/index';

import {Link} from 'react-router-dom';
// import Logo from '#c/images/logo-256x512.png';
import NavbarMobileButton from './NavbarMobileButton';

export default function MainMobileNavbar({layout,search, stickyTop = true, onChange}) {
  const classes = clsx('main-navbar main-mobile', 'bg-white', stickyTop && 'sticky-top');
  const searchform = useSelector((st) => !!st.store.searchvisible);

  // let searchform = '';
console.log("MainMobileNavbar",logoImg);
  return (
    <div className={classes}>
      <Container className="p-0 bgblurbefore">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0 bgblur">
          <NavbarToggle/>
          {search && <SearchToggle/>}


          {/*center logo*/}
          <div className={"nav d-table m-auto oiuytrt tm-ksa-logo-parent2 nonestf " + searchform}>
            {/*<Link to="/">{logoImg && <img style={{maxWidth: 58}} src={logoImg} alt="mainNavBar logo"/>}</Link>*/}
          </div>

          <NavbarMobileButton cartButton={false} logo={false} isAdmin={true} loginUrl={'/admin/login'}/>
          {/*<NavbarNavMobile/>*/}


        </Navbar>
      </Container>
      {(search && searchform) && <NavbarSearch type={'append'}/>}

    </div>
  );
}
