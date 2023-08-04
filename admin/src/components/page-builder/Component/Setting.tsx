import { memo } from 'react';

import CreateForm from '@/components/form/CreateForm';
import Modal from '@/components/global/Modal';

import useStyles from './styles';

const ComponentSetting = ({ component = {}, open, onClose, onSubmit }) => {
  const cls = useStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={component.label}
      className={cls.modal}>
      <div className={cls.container}>
        {component.settings && component.settings.general && (
          <CreateForm
            onSubmit={(e) => {
              onSubmit(component, 'general', e);
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
    </Modal>
  );
};
export default memo(ComponentSetting);
