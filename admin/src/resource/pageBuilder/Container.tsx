import { memo } from 'react';
import { useDrop } from 'react-dnd';
import { styled } from '@mui/material';

interface ComponentProps {
  isOver?: boolean;
}

export const Component = styled('main', {
  shouldForwardProp: (p: string) => !['isOver'].includes(p),
})<ComponentProps>(({ isOver }) => ({
  minHeight: 'calc(100vh - 60px)',
  background: '#fff',
  padding: '8px 16px',
  margin: '0 4px',
  border: isOver ? '1px dashed red' : '1px solid #ddd',
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  '& .cp-row .content': {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 12,
    '& > ': {
      '&:not(.cont-col)': {
        width: '100%',
      },
      '& .cont-col': {
        flex: 1,
        display: 'flex',
      },
    },
  },
}));

const Container = ({ children, onDrop }) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'ITEM',
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [onDrop]
  );

  return (
    <Component ref={dropRef} isOver={isOver}>
      {children}
    </Component>
  );
};

export default memo(Container);
