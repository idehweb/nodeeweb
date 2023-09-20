import { styled } from '@mui/material';

export const Actions = styled('div')({
  display: 'flex',
  marginInlineStart: 16,
  opacity: 0,
  transition: '0.2s ease-in-out',
  '& svg': {
    fontSize: 18,
    color: '#464D55',
  },
});
Actions.defaultProps = {
  className: 'pb-actions',
};

export const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafafa',
  width: '100%',
  height: 30,
  color: '#464d55',
  fontSize: 11,
});
export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 40,
  padding: '8px 16px',
  gap: 8,
});

export const Container = styled('div')({
  border: '1px solid #ddd',
  borderRadius: 4,
  cursor: 'move',
  width: '-webkit-fill-available',
  display: 'flex',
  flexDirection: 'column',
  '&:hover > div > .pb-actions': {
    opacity: 1,
  },
});
export const Footer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafafa',
  width: '100%',
  height: 30,
  color: '#464d55',
  fontSize: 11,
});

export const Title = styled('h3')({
  cursor: 'pointer',
  color: '#fff',
  height: '40px',
  lineHeight: '40px',
  padding: '0px 10px',
  margin: 0,
});

export const ModalContainer = styled('div')({
  maxWidth: 500,
  background: '#fafafa',
  margin: '16px auto',
  overflow: 'auto',
});

export const Child = styled('div')({
  width: '100%',
  padding: '8px 16px',
});
