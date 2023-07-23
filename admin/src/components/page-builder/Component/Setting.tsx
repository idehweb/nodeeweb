import { memo } from 'react';
import { CloseRounded } from '@mui/icons-material';

import CreateForm from '@/components/form/CreateForm';
import Modal from '@/components/global/Modal';

import { DeleteButton, Title, ModalContainer } from './styles';

const ComponentSetting = ({
  component,
  open,
  onClose,
  changeComponentSetting,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="">
      <ModalContainer className="component-set-for-setting">
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
          <Title>{component.label}</Title>
          <DeleteButton onClick={() => onClose()}>
            <CloseRounded />
          </DeleteButton>
        </div>
        <div className="bottom-bar-settings">
          {/*{JSON.stringify(component.settings.general.fields)}*/}
          {component.settings && component.settings.general && (
            <CreateForm
              onSubmit={(e) => {
                changeComponentSetting(component, 'general', e);
                onClose();
              }}
              rules={{ fields: component.settings.general.rules }}
              buttons={[]}
              componentType={component.name}
              childrens={component.children}
              fields={component.settings.general.fields}
            />
          )}
        </div>
      </ModalContainer>
    </Modal>
  );
};
export default memo(ComponentSetting);
