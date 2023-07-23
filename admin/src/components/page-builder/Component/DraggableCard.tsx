import { HTMLAttributes } from 'react';
import { useDrag } from 'react-dnd';
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
    '&:hover > div > .pb-actions': {
      opacity: 1,
    },
    opacity: isDragging ? 0.6 : 1,
    border: isOver ? '1px dashed red' : '1px solid #ddd',
  })
);

interface DraggableCardProps extends HTMLAttributes<HTMLDivElement> {
  item: any;
  canDrag: boolean;
  isOver: boolean;
}
type DraggableProps = Omit<DraggableCardProps, 'canDrag'>;

function Draggable({ item, isOver = false, ...props }: DraggableProps) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'ITEM',
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item]
  );

  return (
    <Component
      ref={dragRef}
      isDragging={isDragging}
      isOver={isOver}
      {...props}
    />
  );
}

export default function DraggableCard({
  canDrag = true,
  isOver = false,
  ...props
}: DraggableCardProps) {
  if (!canDrag) return <Component {...props} />;

  return <Draggable isOver={isOver} {...props} />;
}
