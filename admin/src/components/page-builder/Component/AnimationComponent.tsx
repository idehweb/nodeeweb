import { motion } from 'framer-motion';

import EmptyDropSlot, { EmptyDropSlotProps } from './EmptyDropSlot';

import Component, { ComponentProps } from './';

// interface AnimationComponentProps extends HTMLMotionProps<'div'> {}

export function AnimatedComponent({ animationKey, ...props }: ComponentProps) {
  return (
    <motion.div
      layout
      className={`cont-${props.item.name}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      key={animationKey}>
      <Component {...props} />
    </motion.div>
  );
}

export function AnimatedEmptyDropSlot(props: EmptyDropSlotProps) {
  return (
    <motion.div
      className="cont-slot"
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      key={`${props.item.id}-${props.order}`}>
      <EmptyDropSlot {...props} />
    </motion.div>
  );
}
