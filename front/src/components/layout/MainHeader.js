import React from 'react';
import { Nav, NavItem, NavLink, Button } from 'shards-react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

const CustomNavItem = ({ href, children }) => (
  <NavItem>
    <a className="nav-link" href={href}>
      {children}
    </a>
  </NavItem>
);

const MainHeader = ({ t }) => (
  <header className="main-header d-flex pt-3 pb-1 px-3 bg-white">
    <Nav>
      <NavItem>
        <NavLink tag={Link} to="/">
          {t('home')}
        </NavLink>
      </NavItem>

      <CustomNavItem href="https://blog.myteacher.mobi/info">
        {t('about us')}
      </CustomNavItem>
      <CustomNavItem href="https://blog.myteacher.mobi/payments">
        دفع المستحقات
      </CustomNavItem>

      <CustomNavItem href="https://blog.myteacher.mobi/agreement">
        إتفاقية الإستخدام
      </CustomNavItem>

      <NavItem>
        <a href="https://blog.myteacher.mobi/call-us">
          <Button outline size="sm" theme="primary">
            {t('contact us')}
          </Button>
        </a>
      </NavItem>
    </Nav>
  </header>
);

export default withTranslation()(MainHeader);
