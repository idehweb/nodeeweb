import { HTMLAttributes } from 'react';
import { useDrop } from 'react-dnd';
import { styled } from '@mui/material';

import { OnDropType, OrderType, ItemType } from './types';

interface ComponentProps {
  isOver?: boolean;
}

export const Component = styled('div', {
  shouldForwardProp: (p: string) => !['isOver'].includes(p),
})<ComponentProps>(({ isOver }) => ({
  width: '-webkit-fill-available',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: isOver ? '#ff9800' : 'transparent',
  height: 12,
  borderRadius: 4,
}));

export interface EmptyDropSlotProps extends HTMLAttributes<HTMLDivElement> {
  item: ItemType;
  onDropEnd: OnDropType;
  order: OrderType;
}

export default function EmptyDropSlot({
  item,
  onDropEnd,
  order,
  ...props
}: EmptyDropSlotProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    drop(source: ItemType, monitor) {
      // already dropped
      if (monitor.didDrop()) return;

      onDropEnd(source, item, order);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <Component className="cp-slot" ref={drop} isOver={isOver} {...props} />
  );
}
