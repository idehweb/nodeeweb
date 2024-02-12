import {
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate,
} from 'react-admin';

import { dateFormat } from '@/functions';
import { JsonDiffer, List, SimpleForm, UploaderField } from '@/components';
import Undo from '@/components/Undo';
import { Val } from '@/Utils';
import { display } from '@mui/system';

export const activityShow = (props) => {
  const translate = useTranslate();
  return (
    <>
      <Show {...props}>
        <Undo record={props} />
        {/* todo ------> data coming from back are not complete - no user or customer data  */}
        <SimpleShowLayout>
          <TextField
            source="type"
            label={translate('resources.action.title')}
          />
          <TextField
            source="customer.phoneNumber"
            label={translate('resources.action.phoneNumber')}
          />

          <TextField
            source="customer.firstName"
            label={translate('resources.action.customerFirstName')}
          />
          <TextField
            source="customer.lastName"
            label={translate('resources.action.customerLastName')}
          />
          <TextField
            source="user.firstName"
            label={translate('resources.action.userFirstName')}
          />
          <TextField
            source="user.lastName"
            label={translate('resources.action.userLastName')}
          />
          <TextField
            source="user.username"
            label={translate('resources.action.username')}
          />
          <TextField
            source="product"
            label={translate('resources.action.product')}
          />
          <FunctionField
            label={translate('resources.action.difference')}
            render={(record) => {
              return (
                <JsonDiffer
                  object1={record.target.before}
                  object2={record.target.after}
                />
                // <JsonDiffer object1={record.data} object2={record.history} />
              );
            }}
          />
        </SimpleShowLayout>
      </Show>
    </>
  );
};
export default activityShow;
