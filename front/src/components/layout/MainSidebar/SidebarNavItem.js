import React from 'react';
import { NavLink as RouteNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'shards-react';
import { withTranslation } from 'react-i18next';

const SidebarNavItem = ({ item, t, onClick }) => (
  <NavItem>
    <NavLink tag={(props) => <RouteNavLink {...props} />} to={item.to} onClick={() => onClick(item)}>
      {item.htmlBefore && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
        />
      )}
      {item.title && <span>{t(item.title)}</span>}
      {item.htmlAfter && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
        />
      )}
    </NavLink>
  </NavItem>
);

export default withTranslation()(SidebarNavItem);
