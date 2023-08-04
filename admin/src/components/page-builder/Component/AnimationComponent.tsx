import { motion, HTMLMotionProps } from 'framer-motion';

import EmptyDropSlot, { EmptyDropSlotProps } from './EmptyDropSlot';

import Component, { ComponentProps } from './';

interface AnimationComponentProps extends HTMLMotionProps<'div'> {}

export function AnimatedComponent({ animationKey, ...props }: ComponentProps) {
  return (
    <motion.div
      layout="position"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: 'just' }}
      key={animationKey}>
      <Component {...props} />
    </motion.div>
  );
}

export function AnimatedEmptyDropSlot(props: EmptyDropSlotProps) {
  return (
    <motion.div
      layout="position"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: 'just' }}
      key={`${props.item.id}-${props.order}`}>
      <EmptyDropSlot {...props} />
    </motion.div>
  );
}
