import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonBase } from '@mui/material';
import { styled } from '@mui/material';
import Fab from '@mui/material/Fab';
import { red, green, blue } from '@mui/material/colors';

export const Tabs = styled('nav')({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  background: '#29b6f6',
  borderRadius: '4px',
  overflow: 'hidden',
  '& button': {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '12px',
    minWidth: 150,
    transition: 'all 0.2s ease-in-out',
    '&.active': {
      backgroundColor: '#ab47bc',
    },
  },
});

export const Component = styled('header')({
  height: 60,
  background: '#fff',
  color: '#000000',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  position: 'relative',
  borderBottom: '1px solid #ddd',
});

export const NewTabs = styled('nav')({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'hidden',
});

export const NewFab = styled(Fab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    size: 'small',
  },
  background: '#00aced',
  color: '#fff',
}));

// export const NewButton = styled(Button)({
export const NewButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: 80,
    height: 35,
    fontSize: 11,
    padding: 1,
  },
  color: '#00aced',
  border: '1px solid #00aced',
  boxShadow: '0 0 5px #00aced, 0 0 5px #00aced inset',
  width: 130,
  height: 40,
  padding: '10px 25px',
  fontWeight: 500,
  background: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  display: 'inline-block',
  zIndex: 1,
  margin: '5px',
  fontFamily: ['sans-serif', 'Arial'].join(','),
  '&:hover': {
    color: '#fff',
  },
  '&:after': {
    position: 'absolute',
    content: '""',
    width: 0,
    height: '100%',
    top: 0,
    right: 0,
    zIndex: -1,
    background: '#00aced',
    boxShadow: '0 0 20px  #00aced',
    transition: 'all 0.3s ease',
  },
  '&:hover:after': {
    left: 0,
    width: '100%',
  },
  '&:active': {
    top: '2px',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
}));
