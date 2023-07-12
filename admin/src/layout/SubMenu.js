import * as React from 'react';
import { Fragment, ReactElement, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  MenuItem,
  ListItemIcon,
  Typography,
  Collapse,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslate, ReduxState, useSidebarState } from 'react-admin';

const useStyles = makeStyles((theme) => ({
  icon: { minWidth: theme.spacing(5) },
  sidebarIsOpen: {
    '& a': {
      transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
      paddingLeft: theme.spacing(4),
    },
  },
  sidebarIsClosed: {
    '& a': {
      transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
      paddingLeft: theme.spacing(2),
    },
  },
}));

const SubMenu = (props) => {
  const { handleToggle, isOpen, name, label, icon, children, dense } = props;
  const translate = useTranslate();
  const classes = useStyles();

  const [sidebarIsOpen] = useSidebarState();

  const header = (
    <MenuItem
      dense={dense}
      button={'true'}
      onClick={handleToggle}
      className={'vas'}>
      <ListItemIcon className={classes.icon}>
        {isOpen ? <ExpandMore /> : icon}
      </ListItemIcon>
      <Typography variant="inherit" color="textSecondary">
        {label || name}
      </Typography>
    </MenuItem>
  );

  return (
    <Fragment>
      {sidebarIsOpen || isOpen ? (
        header
      ) : (
        <Tooltip title={label || name} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          className={
            sidebarIsOpen
              ? classes.sidebarIsOpen
              : classes.sidebarIsClosed + ' vdfghj'
          }>
          {children}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default SubMenu;
