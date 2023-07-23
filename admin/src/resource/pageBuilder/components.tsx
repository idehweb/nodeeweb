import { styled } from '@mui/material';

export const Header = styled('div')({
  background: '#fff',
  direction: 'ltr',
  color: '#000000',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  position: 'relative',
});

export const Tabs = styled('div')({
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

interface ContainerProps {
  isDragging?: boolean;
}

export const Container = styled('div')<ContainerProps>(({ isDragging }) => ({
  height: '100vh',
  opacity: isDragging ? 0.5 : 1,
  background: '#fff',
  padding: '16px',
  border: '1px dashed #ddd',
}));

export const AddContainer = styled('div')({
  width: '100%',
  borderRadius: 4,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  marginTop: 12,
  padding: 30,
});

export const Wrapper = styled('div')({});
