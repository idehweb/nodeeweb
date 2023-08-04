import { Fragment, memo } from 'react';
import { AnimatePresence } from 'framer-motion';

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
import { ItemType, OnDropType } from './types';
import { AnimatedComponent, AnimatedEmptyDropSlot } from './AnimationComponent';

export interface ComponentProps {
  index: number;
  item: ItemType;
  onDelete: (id: string) => void;
  onAdd: (payload: any) => void;
  onEdit: (item: ItemType) => void;
  onDrop: OnDropType;
  animationKey?: React.Key;
}

const Component = ({
  index,
  item,
  onDelete,
  onAdd,
  onEdit,
  onDrop,
}: ComponentProps) => {
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

      <Content className="content">
        {item.addable && (
          <AnimatePresence presenceAffectsLayout>
            {item.children?.map((i, idx) => (
              <Fragment key={idx}>
                <AnimatedEmptyDropSlot
                  item={i}
                  onDropEnd={onDrop}
                  order="middle"
                />

                <AnimatedComponent
                  animationKey={`${i.id}`}
                  index={idx}
                  item={i}
                  onEdit={() => onEdit(i)}
                  onDelete={onDelete}
                  onAdd={onAdd}
                  onDrop={onDrop}
                />

                {idx === item.children.length - 1 ? (
                  <AnimatedEmptyDropSlot
                    item={i}
                    onDropEnd={onDrop}
                    order="last"
                  />
                ) : null}
              </Fragment>
            ))}
          </AnimatePresence>
        )}
      </Content>
    </DraggableCard>
  );
};
export default memo(Component);
