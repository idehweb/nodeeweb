import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

export const StyledMenu = styled((props) => (
  <Menu
    elevation={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    width: 200,
    '& .MuiMenuItem-root': {
      fontSize: '1em',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: '#2196f3',
        color: '#255784',
        letterSpacing: '0.2em',
        boxShadow: '0 0 10px #2196f3 ,  0 0 40px #2196f3 , 0 0 80px #2196f3',
      },
    },
  },
}));

export const GPTButton = styled(Button)({
  transition: '0.1s',
  boxShadow: 'none',
  color: '#fff',
  letterSpacing: '0.1em',
  fontSize: '0.8em',
  padding: '5px 10px',
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
