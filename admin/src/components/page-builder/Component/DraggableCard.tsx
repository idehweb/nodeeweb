import { HTMLAttributes, useRef, useLayoutEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { styled } from '@mui/material';

interface ComponentProps {
  isDragging?: boolean;
  isOver?: boolean;
}

export const Component = styled('div')<ComponentProps>(
  ({ isDragging, isOver }) => ({
    margin: '8px 16px',
    borderRadius: 4,
    cursor: 'move',
    borderStyle: 'dashed',
    borderWidth: 1,
    '&:hover > div > .pb-actions': {
      opacity: 1,
    },
    '&:hover': {
      borderColor: '#29b6f6',
    },
    opacity: isDragging ? 0.6 : 1,
    borderColor: isOver ? 'red' : '#ddd',
  })
);

interface DraggableCardProps extends HTMLAttributes<HTMLDivElement> {
  item: any;
  canDrag: boolean;
  onDropEnd(a: any, b: any): void;
}
type DraggableProps = Omit<DraggableCardProps, 'canDrag'>;

function Draggable({ item, onDropEnd, ...props }: DraggableProps) {
  const ref = useRef(null); // Initialize the reference

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ITEM',
    drop(source, monitor) {
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
