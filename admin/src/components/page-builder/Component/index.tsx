import { memo } from 'react';
import { useDrop } from 'react-dnd';

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
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'ITEM',
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  return (
    <div ref={dropRef}>
      <DraggableCard
        className={`name-${item.name}`}
        canDrag
        isOver={isOver}
        item={item}>
        <Header>
          {`${item.name} ${index + 1}: ${item.id}`}
          <Actions>
            <EditButton onClick={() => onEdit(item)}>
              <EditIconSvg />
            </EditButton>
            <DeleteButton
              onClick={(e) => {
                e.preventDefault();

                onDelete(item.id);
              }}>
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

        <Content>
          {item.addable &&
            item.children?.map((i, idx) => (
              <Component
                index={idx}
                item={i}
                onEdit={() => onEdit(i)}
                onDelete={onDelete}
                onAdd={onAdd}
                onDrop={onDrop}
              />
            ))}
        </Content>
      </DraggableCard>
    </div>
  );
};
export default memo(Component);
