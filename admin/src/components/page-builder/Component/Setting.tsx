import { memo } from 'react';
import _get from 'lodash/get';

import CreateForm from '@/components/form/CreateForm';
import Modal from '@/components/global/Modal';

import useStyles from './styles';
import { ItemType } from './types';

const ComponentSetting = ({
  component = {} as ItemType,
  open,
  onClose,
  onSubmit,
}) => {
  const cls = useStyles();

  const DATA = _get(component, 'settings.general', undefined);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={component.label}
      className={cls.modal}>
      <div className={cls.container}>
        {DATA && (
          <CreateForm
            onSubmit={(v) => {
              onSubmit(component, 'general', v);
              onClose();
            }}
            rules={{ fields: DATA.rules }}
            componentType={component.name}
            fields={DATA.fields}>
            {component.children}
          </CreateForm>
        )}
      </div>
    </Modal>
  );
};
export default memo(ComponentSetting);
