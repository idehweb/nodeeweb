import { styled } from '@mui/material';

export const Header = styled('div')({
  background: '#ffffff',
  padding: '4px 0px 4px 4px',
  direction: 'ltr',
  border: '1px solid #ddd',
  color: '#000000',
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'space-between',
});

export const TabButton = styled('button')({
  background: '#464D55',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  border: 'none !important',
  cursor: 'pointer',
  padding: '3px',
});

interface ContainerProps {
  isDragging?: boolean;
}

export const Container = styled('div')<ContainerProps>(({ isDragging }) => ({
  height: '100vh',
  width: '100vw !important',
  opacity: isDragging ? 0.5 : 1,
  background: '#ffffff',
  padding: '20px',
}));
