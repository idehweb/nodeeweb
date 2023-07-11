import {

    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    TextField,
  useTranslate
} from 'react-admin';

import {List, SimpleForm} from '@/components';

export const notificationList = (props) => {
  const translate = useTranslate();
  return(

    <List {...props}>
      <Datagrid>
        <TextField source="phoneNumber" label={translate('resources.notification.receiver')}/>
        <TextField source="message" label={translate('resources.notification.message')}/>
        <TextField source="status" label={translate('resources.notification.status')}/>
        <TextField source="from" label={translate('resources.notification.sender')}/>
        <DateField source="createdAt" showTime label={translate('resources.notification.createdAt')}/>
        <DateField source="updatedAt" showTime label={translate('resources.notification.updatedAt')}/>
        <EditButton/>
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export default notificationList;
