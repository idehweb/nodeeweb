import * as React from 'react';
import { forwardRef } from 'react';
import {
  AppBar,
  defaultTheme,
  MenuItemLink,
  ToggleThemeButton,
  UserMenu,
  useTranslate,
  useNotify,
  useUserMenu,
} from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { makeStyles } from '@mui/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { createTheme } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { restartSystem, upgradeSystem } from '@/functions/index';
import { Configuration, ToggleConfigButton } from '@/components';

const useStyles = makeStyles({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  spacer: {
    flex: 1,
  },
});

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});
const UserProfileMenu = forwardRef((props, ref) => {
  const translate = useTranslate();
  const userId = localStorage.getItem('user_id');
  const { onClose } = useUserMenu();

  return (
    <MenuItemLink
      ref={ref}
      to={'/admin/' + userId}
      primaryText={translate('pos.profile')}
      leftIcon={<ManageAccountsIcon />}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        onClose();
      }}
      sidebarIsOpen
    />
  );
});
const ConfigurationMenu = forwardRef((props, ref) => {
  const translate = useTranslate();
  const { onClose } = useUserMenu();

  return (
    <MenuItemLink
      ref={ref}
      to="/configuration"
      primaryText={translate('pos.configuration')}
      leftIcon={<SettingsIcon />}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        onClose();
      }}
      sidebarIsOpen
    />
  );
});
const RestartSystem = forwardRef((props, ref) => {
  const translate = useTranslate();
  const { onClose } = useUserMenu();
  const notify = useNotify();

  return (
    <MenuItemLink
      ref={ref}
      to="#"
      primaryText={translate('pos.menu.restart')}
      leftIcon={<RestartAltIcon />}
      onClick={(e) => {
        restartSystem();
        notify(translate('restarted'));

        // if (props.onClick)
        //   props.onClick(e);
        onClose();
      }}
      sidebarIsOpen>
      {translate('pos.menu.restart')}
    </MenuItemLink>
  );
});
const UpgradeSystem = forwardRef((props, ref) => {
  const translate = useTranslate();
  const { onClose } = useUserMenu();
  const notify = useNotify();

  return (
    <MenuItemLink
      ref={ref}
      to="#"
      primaryText={translate('pos.menu.upgrade')}
      leftIcon={<SystemUpdateAltIcon />}
      onClick={(e) => {
        upgradeSystem();
        notify(translate('upgraded'));

        // if (props.onClick)
        //   props.onClick(e);
        onClose();
      }}
      sidebarIsOpen>
      {translate('pos.menu.upgrade')}
    </MenuItemLink>
  );
});

const LogoutMenu = forwardRef((props, ref) => {
  const translate = useTranslate();
  const { onClose } = useUserMenu();
  return (
    <MenuItemLink
      ref={ref}
      to="/logout"
      primaryText={translate('pos.logout')}
      leftIcon={<LogoutIcon />}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        onClose();
      }}
      sidebarIsOpen>
      {translate('logout')}
    </MenuItemLink>
  );
});

const CustomUserMenu = (props) => {
  console.log('props', props);
  return (
    <UserMenu {...props} icon={<MoreHorizIcon />}>
      <UserProfileMenu />
      <ConfigurationMenu />
      <Configuration />
      <RestartSystem />
      <UpgradeSystem />
      <LogoutMenu />
    </UserMenu>
  );
};

const CustomAppBar = (props) => {
  const classes = useStyles();

  return (
    <AppBar {...props} elevation={1} userMenu={<CustomUserMenu />}>
      {/*<Typography*/}
      {/*variant="h6"*/}
      {/*color="inherit"*/}
      {/*className={classes.title}*/}
      {/*id="react-admin-title"*/}
      {/*/>*/}
      {/*<Logo />*/}
      <span className={classes.spacer} />
      {/**/}
      <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
      {/*<ToggleConfigButton />*/}
    </AppBar>
  );
};

export default CustomAppBar;
