import React, {useState} from 'react';

import {Button, Collapse, DropdownMenu, DropdownToggle,DropdownItem,Dropdown, Nav, NavItem, NavLink} from 'shards-react';
import {Link, NavLink as RouteNavLink} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import store from "../../../functions/store";
import {useSelector} from 'react-redux';
import {Logout} from '#c/functions/index';

const CustomNavItem = ({href, text,children}) => (
  <NavItem>
    <NavLink tag={(props) => <RouteNavLink {...props} />} to={href} className="">

      {/*<a className="nav-link" href={href}>*/}
      {text}
      {/*</a>*/}
    </NavLink>
    {children}
  </NavItem>
);


const NavbarMenu = ({t}) => {
  // let card = useSelector((st) => st.store.card || []);
  let appAllCategories = useSelector((st) => st.store.allCategories || []);
  let [user, setuser] = useState(store.getState().store.user);
  let [visible, setVisible] = useState(false);

  const [selectedCats, setSelectedCats] = useState(appAllCategories || []);
  // useEffect(() => {
  //   console.log('useEffect navbar', visible);
  //
  // }, [visible]);
  const toggleProfileActions = () => {
    console.log('toggleProfileActions');
    setVisible(!visible);

  }
  // console.clear();
  // console.log('selectedCats', selectedCats);

  return (
    <div className="main-header d-flex  px-3 bg-white mobilenone">
      <Nav>
        {/*<NavItem>*/}
        {/*<NavLink tag={(props) => <Link {...props} />} to="/">*/}
        {/*home*/}
        {/*</NavLink>*/}
        {/*</NavItem>*/}

        {/*<CustomNavItem href="/categories">*/}
        {/*{t('categories')}*/}


        {/*</CustomNavItem>*/}
        {/*<CustomNavItem href="/get-price">*/}

        {/*{t('get price')}*/}


        {/*</CustomNavItem>*/}

        {/*<NavItem>*/}
        {/*<a className={'nav-link'} href="https://www.arvandguarantee.com/" target="_blank">*/}
        {/*{t('arvandguarantee')}*/}

        {/*</a>*/}
        {/*</NavItem>*/}
        <NavItem className={'left-button-border'}>
          {/*<a className="nav-link p-0" href={'/login'}>*/}

          {(!user || !user.phoneNumber || !user.token) &&
          <NavLink tag={(props) => <RouteNavLink {...props} />} to={'/login'} className="p-0">
            <Button size="md" theme="primary">{t('Login / Register')}</Button>
          </NavLink>}


          {/*{(user && !user.firstName) && user.phoneNumber}*/}
          {/*{(user && user.firstName) && (t('welcome ') + user.firstName)}*/}
          {/*{!user && t('Login / Register')}*/}
          {(user && user.phoneNumber && user.token) && <Dropdown open={visible} toggle={toggleProfileActions}>
            <DropdownToggle caret={true} tag={NavLink} className="text-nowrap px-3 helldone"
                         >
              {(user && !user.firstName) && user.phoneNumber}
              {(user && user.firstName) && (user.firstName+ ' خوش آمدید')}

            </DropdownToggle>
            <DropdownMenu right={true} small={true}>
              <Link

                className={'dropdown-item'}
                to={'/profile/'}
                onClick={() => {
                  // this.changeCat(cate._id)
                }}>
                {t('profile')}

              </Link>
              <Link

                className={'dropdown-item'}
                to={'/my-orders/'}
                onClick={() => {
                  // this.changeCat(cate._id)
                }}>
                {t('my orders')}


              </Link>
              <Link

                className={'dropdown-item'}
                to={'/wishlist/'}
                onClick={() => {
                  // this.changeCat(cate._id)
                }}>
                {t('Wishlist')}


              </Link>
              <hr/>

              <DropdownItem

                className={'dropdown-item logoutred'}
                to={'/'}
                onClick={() => {
                  Logout();
                }}>
                {t('logout')}


              </DropdownItem>

            </DropdownMenu>
          </Dropdown>}
          {/*</NavLink>*/}

          {/*</a>*/}
        </NavItem>
      </Nav>
    </div>
  );
}

export default withTranslation()(NavbarMenu);
