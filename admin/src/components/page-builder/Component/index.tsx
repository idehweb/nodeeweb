import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { EditIconSvg, CloseIconSvg, AddIconSvg } from '../base/Icon';

import {
  AddButton,
  EditButton,
  DeleteButton,
  Actions,
  Header,
  Content,
} from './components';
import DraggableCard from './DraggableCard';

interface Props {
  index: number;
  [key: string]: any;
}

const Component = ({ index, item, onDelete, onAdd, onEdit, onDrop }: Props) => {
  return (
    <DraggableCard
      className={`cp-${item.name}`}
      canDrag
      item={item}
      onDropEnd={onDrop}>
      <Header>
        {`${item.name} ${index + 1}: ${item.id}`}
        <Actions>
          <EditButton onClick={() => onEdit(item)}>
            <EditIconSvg />
          </EditButton>
          <DeleteButton onClick={() => onDelete(item.id)}>
            <CloseIconSvg width="20px" height="20px" background="#464D55" />
          </DeleteButton>
          {item.addable && (
            <AddButton
              onClick={(e) => {
                let address = item.id + '_';
                let mainAddress = address.split('_');
                let update = { sourceAddress: item.id };
                if (mainAddress[4]) {
                  update['excludeArray'] = ['row'];
                } else {
                  update['excludeArray'] = [];
                }
                onAdd(update);
              }}>
              <AddIconSvg />
            </AddButton>
          )}
        </Actions>
      </Header>

      <Content className='content'>
        <AnimatePresence presenceAffectsLayout>
          {item.addable &&
            item.children?.map((i, idx) => (
              <motion.div
                key={`${i.id}`}
                layout="position"
                className={`cont-${i.name}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'just' }}>
                <Component
                  index={idx}
                  item={i}
                  onEdit={() => onEdit(i)}
                  onDelete={onDelete}
                  onAdd={onAdd}
                  onDrop={onDrop}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </Content>
    </DraggableCard>
  );
};
export default memo(Component);
