import { Fragment, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  CloseRounded,
  EditRounded,
  ContentCopyRounded,
  AddRounded,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { Actions, Header, Content } from './components';
import DraggableCard from './DraggableCard';
import { ItemType, OnDropType } from './types';
import { AnimatedComponent, AnimatedEmptyDropSlot } from './AnimationComponent';

export interface ComponentProps {
  index: number;
  item: ItemType;
  onDelete: (id: string) => void;
  onAdd: (payload: any) => void;
  onEdit: (item: ItemType) => void;
  onDuplicate: (item: ItemType) => void;
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
  onDuplicate,
}: ComponentProps) => {
  return (
    <DraggableCard
      className={`cp-${item.name}`}
      canDrag
      item={item}
      onDropEnd={onDrop}>
      <Header>
        <Actions>
          {/* <IconButton title="Duplicate" onClick={() => onDuplicate(item)}>
            <ContentCopyRounded />
          </IconButton> */}
          <IconButton title="Delete" onClick={() => onDelete(item.id)}>
            <CloseRounded />
          </IconButton>

          <p>{`${item.name} ${index + 1}: ${item.id}`}</p>

          <IconButton title="Edit" onClick={() => onEdit(item)}>
            <EditRounded />
          </IconButton>
          {item.addable && (
            <IconButton
              title="Add"
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
              <AddRounded />
            </IconButton>
          )}
        </Actions>
      </Header>

      <Content className="content">
        {item.addable && (
          <AnimatePresence presenceAffectsLayout>
            {item.children?.map((i, idx) => (
              <Fragment key={i.id}>
                <AnimatedEmptyDropSlot
                  item={i}
                  onDropEnd={onDrop}
                  order="middle"
                />

                <AnimatedComponent
                  animationKey={`${i.id}`}
                  index={idx}
                  item={i}
                  onEdit={(v) => onEdit(v)}
                  onDelete={onDelete}
                  onAdd={onAdd}
                  onDrop={onDrop}
                  onDuplicate={onDuplicate}
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
