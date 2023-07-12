import { useState, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { CloseRounded } from '@mui/icons-material';
import clsx from 'clsx';

import { ItemTypes } from '@/functions';
import CreateForm from '@/components/form/CreateForm';

import {
  MoveIconSvg,
  EditIconSvg,
  CloseIconSvg,
  AddIconSvg,
} from '../base/Icon';

import { EditButton, MoveButton, CloseButton } from './styles';

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
    <div className="nodeweb-element-wrapper">
      <div className={clsx('element-header', index > 2 && 'mtop-10')}>
        <span>
          {`Element ${component.name} ${index + 1} CP: ${component.id}`}
        </span>
      </div>
      <div className="controller">
        <MoveButton
          className="move"
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
          <MoveIconSvg width="15px" height="15px" background="#464D55" />
        </MoveButton>
        <EditButton
          onClick={() => setComponentForSetting(!componentForSetting)}
          className="edit">
          <EditIconSvg
            width={15}
            height={15}
            fill="none"
            background="#464D55"
          />
        </EditButton>
      </div>
      <div className="content">
        {!componentForSetting && (
          <div>
            {component.addable && (
              <div className={`add-part p-2 name-${component.name}`}>
                <div
                  className="element-wrapper-child"
                  id={component.id}
                  ref={dropRef}
                  onDrop={(e) => onDrop(setDropElement)}>
                  {Boolean(
                    component.children && component.children instanceof Array
                  ) &&
                    component.children.map((comp, jj) => {
                      return (
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
                      );
                    })}
                </div>
              </div>
            )}
          </div>
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
        {/*StartModalSetting*/}
        {componentForSetting && (
          <div className="component-set-for-setting">
            <div className="csfs-a">
              <div className="csfs-c">
                <div className="top-bar-settings">
                  {/* <Button
                      className={"redxxx"}
                      onClick={(e) => {
                        e.preventDefault();
                        setComponentForSetting(false);
                        deleteItem(component.id);
                      }}>
                      <DeleteForeverIcon/>{("Delete")}
                    </Button> */}
                  <span
                    style={{
                      cursor: 'pointer',
                      color: '#ffffff',
                      height: '40px',
                      lineHeight: '40px',
                      padding: '0px 10px',
                    }}>
                    {component.label}
                  </span>
                  <CloseButton>
                    <CloseRounded
                      onClick={() => {
                        setComponentForSetting(!componentForSetting);
                      }}
                    />
                  </CloseButton>
                </div>
                <div className="bottom-bar-settings">
                  {/*{JSON.stringify(component.settings.general.fields)}*/}
                  {component.settings && component.settings.general && (
                    <CreateForm
                      onSubmit={(e) => {
                        changeComponentSetting(component, 'general', e);
                        setComponentForSetting(!componentForSetting);
                      }}
                      rules={{ fields: component.settings.general.rules }}
                      buttons={[]}
                      componentType={component.name}
                      childrens={component.children}
                      fields={component.settings.general.fields}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="element-footer">
        <div>
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              setComponentForSetting(false);
              deleteItem(component.id);
            }}>
            <CloseIconSvg width="20px" height="20px" background="#464D55" />
          </span>
          <span
            style={{ margin: '0px 10px', cursor: 'pointer' }}
            onClick={() => setComponentForSetting(!componentForSetting)}>
            <EditIconSvg width="15px" height="15px" background="#464D55" />
          </span>
          {component.addable && (
            <span
              style={{ cursor: 'pointer' }}
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
              <AddIconSvg width="15px" height="15px" fill="#464D55" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default memo(Component);
