import { memo } from 'react';
import { useDrop } from 'react-dnd';
import { styled } from '@mui/material';

interface ComponentProps {
  isOver?: boolean;
}

export const Component = styled('div')<ComponentProps>(({ isOver }) => ({
  height: '100vh',
  background: '#fff',
  paddingTop: '12px',
  margin: '0 4px',
  border: isOver ? '1px dashed red' : '1px solid #ddd',
  borderRadius: 4,
}));

const Container = ({ children, onDrop }) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'ITEM',
      drop: onDrop,
      canDrop: (i: any) => i?.addable,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
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
