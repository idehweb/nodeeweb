import { useState, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ItemTypes } from '@/functions';

import {
  MoveIconSvg,
  EditIconSvg,
  CloseIconSvg,
  AddIconSvg,
} from '../base/Icon';

import {
  AddButton,
  EditButton,
  MoveButton,
  DeleteButton,
  Actions,
  Header,
  Container,
  Child,
  Content,
} from './styles';
import ComponentSetting from './Setting';

// refactor this component to support drag and drop
const Component = (props) => {
  console.log('Cooooooooooooooooooooooooooo', props);
  const [componentForSetting, setComponentForSetting] = useState(false);

  const {
    index,
    component,
    deleteItem,
    changeComponentSetting,
    toggleComponentOptionsBox,
    setSourceAddress,
    toggleOptionBox,
    length,
    address = 0,
    setExcludeArray,
    child,
    setDropElement,
    startDestHnadler,
  } = props;
  let { settings = {} } = component;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { text = '' } = fields;
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.KNIGHT,
    item: { id: component.id, component: component },
    end: (item, monitor) => {},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.KNIGHT,
    drop: (item, monitor) =>
      // @ts-ignore
      startDestHnadler(item.id, setDropElement, component),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const addToComponent = (dragID, dropID) => {
    // console.log('FuckU',dropID);
    startDestHnadler(dragID, dropID, component);
  };
  const dragStart = (e, component) => {};
  const dragEnter = (e, component) => {};
  const onDrop = (c) => {};

  return (
    <Container>
      <Header>
        {`${component.name} ${index + 1}: ${component.id}`}

        <Actions>
          <MoveButton
            id={component.id}
            ref={dragRef}
            onDragStart={(e) => dragStart(e, component)}
            draggable="true"
            // draggable
            // onDragStart={(e) => dragStart(e, component)}
            // onDragEnd={(e) => {
            //   console.log('on drop on label:',component.id)
            //   onDrop(component);
            // }}
            // onDragEnter={(e) => dragEnter(e, component)}
          >
            <MoveIconSvg />
          </MoveButton>
          <EditButton
            onClick={() => setComponentForSetting(!componentForSetting)}>
            <EditIconSvg />
          </EditButton>
          <DeleteButton
            onClick={(e) => {
              e.preventDefault();
              setComponentForSetting(false);
              deleteItem(component.id);
            }}>
            <CloseIconSvg width="20px" height="20px" background="#464D55" />
          </DeleteButton>
          {component.addable && (
            <AddButton
              onClick={(e) => {
                let address = component.id + '_';
                let mainAddress = address.split('_');
                let update = { sourceAddress: component.id };
                if (mainAddress[4]) {
                  update['excludeArray'] = ['row'];
                } else {
                  update['excludeArray'] = [];
                }
                toggleOptionBox(update);
              }}>
              <AddIconSvg />
            </AddButton>
          )}
        </Actions>
      </Header>

      <Content>
        {!componentForSetting && component.addable && (
          <Child
            className={`name-${component.name}`}
            id={component.id}
            ref={dropRef}
            onDrop={(e) => onDrop(setDropElement)}>
            {component.children?.map((comp, jj) => (
              <Component
                key={jj}
                index={jj}
                component={comp}
                childrens={component.children}
                // moveItem={moveItem}
                // moveContent={moveContent}
                setComponentForSetting={setComponentForSetting}
                toggleComponentOptionsBox={toggleComponentOptionsBox}
                setExcludeArray={() => setExcludeArray([])}
                changeComponentSetting={(e, j, d) =>
                  changeComponentSetting(e, j, d)
                }
                deleteItem={(e) => {
                  setComponentForSetting(false);
                  deleteItem(e);
                }}
                toggleOptionBox={toggleOptionBox}
                length={component.children.length}
                address={component.id + '_' + jj}
                child={true}
                setDropElement={comp && comp.id}
                startDestHnadler={addToComponent}
              />
            ))}
          </Child>
        )}
        {isOver && child && (
          <div
            style={{
              width: '100%',
              height: '5px',
              border: '1px solid #ddd',
              background: '#ddd',
            }}
          />
        )}

        <ComponentSetting
          component={component}
          open={componentForSetting}
          onClose={() => setComponentForSetting(false)}
          changeComponentSetting={changeComponentSetting}
        />
      </Content>
    </Container>
  );
};
export default memo(Component);
