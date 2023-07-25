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
  onDropEnd(a: any, b: any): void;
}
type DraggableProps = Omit<DraggableCardProps, 'canDrag'>;

function Draggable({ item, onDropEnd, ...props }: DraggableProps) {
  const ref = useRef(null); // Initialize the reference

  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    drop: () => item,
    canDrop: (i: any) => i?.addable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'ITEM',
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end(source, monitor) {
        onDropEnd(source, monitor.getDropResult());
      },
    }),
    [item]
  );
  useLayoutEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  return (
    <Component ref={ref} isDragging={isDragging} isOver={isOver} {...props} />
  );
}

export default function DraggableCard({
  canDrag = true,
  ...props
}: DraggableCardProps) {
  if (!canDrag) return <Component {...props} />;

  return <Draggable {...props} />;
}
