import { styled } from '@mui/system';

export const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const HR = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: spacing(2, 0),
  width: '100%',
  color: '#9E9E9E',
  fontSize: 14,
  '&:before, &:after': {
    content: '""',
    border: 'none',
    height: 2,
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  '& span': {
    margin: '0 5px',
  },
}));

export const Row = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
}));
