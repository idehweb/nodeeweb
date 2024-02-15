import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';

const GPTButton = styled(Button)({
  transition: '0.5s',
  boxShadow: 'none',
  color: '#fff',
  letterSpacing: '0.1em',
  fontSize: '0.8em',
  padding: '5px 15px',
  margin: ' 10px 1px',
  border: '1px solid',
  backgroundColor: '#27282c',
  borderColor: '#0063cc',
  fontFamily: ['sans-serif', 'Arial', 'Roboto'].join(','),
  '&:hover': {
    backgroundColor: '#27282c',
    color: '#1e9bff',
    borderColor: '#1e9bff',
    letterSpacing: '0.25em',
    boxShadow: '0 0 35px #1e9bff',
  },
  '&:active': {
    backgroundColor: '#27282c',
    color: '#1e9bff',
    borderColor: '#1e9bff',
    letterSpacing: '0.25em',
    boxShadow: '0 0 35px #1e9bff',
  },
});

export default (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <GPTButton startIcon={<ArrowDropDownIcon />} onClick={handleClick}>
        ASK CHATGPT FOR
      </GPTButton>
      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        <MenuItem onClick={handleClose}>Excerpt</MenuItem>
        <MenuItem onClick={handleClose}>Met title</MenuItem>
        <MenuItem onClick={handleClose}>Description</MenuItem>
      </Menu>
    </div>
  );
};
