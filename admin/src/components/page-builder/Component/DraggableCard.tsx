import { HTMLAttributes, useRef, useLayoutEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { styled } from '@mui/material';

import { OnDropType, ItemType } from './types';

interface ComponentProps {
  isDragging?: boolean;
  isOver?: boolean;
}

export const Component = styled('div', {
  shouldForwardProp: (p: string) => !['isDragging', 'isOver'].includes(p),
})<ComponentProps>(({ isDragging, isOver }) => ({
  borderRadius: 4,
  cursor: 'move',
  borderStyle: 'dashed',
  borderWidth: 1,
  width: '-webkit-fill-available',
  display: 'flex',
  flexDirection: 'column',
  '&:hover > div > .pb-actions button': {
    opacity: 1,
  },
  '&:hover': {
    borderColor: '#29b6f6',
  },
  opacity: isDragging ? 0.6 : 1,
  borderColor: isOver ? 'red' : '#ddd',
}));

interface DraggableCardProps extends HTMLAttributes<HTMLDivElement> {
  item: ItemType;
  canDrag: boolean;
  onDropEnd: OnDropType;
}
type DraggableProps = Omit<DraggableCardProps, 'canDrag'>;

function Draggable({ item, onDropEnd, ...props }: DraggableProps) {
  const ref = useRef(null); // Initialize the reference

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ITEM',
    drop(source: ItemType, monitor) {
      // already dropped
      if (monitor.didDrop()) return;

      onDropEnd(source, item);
    },
    canDrop: () => item?.addable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'ITEM',
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item]
  );
  useLayoutEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  return (
    <Component
      ref={ref}
      isDragging={isDragging}
      isOver={isOver && canDrop}
      {...props}
    />
  );
}

export default function DraggableCard({
  canDrag = true,
  ...props
}: DraggableCardProps) {
  if (!canDrag) return <Component {...props} />;

  return <Draggable {...props} />;
}
