import {
  BooleanInput,
  Edit,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  TextInput,
} from 'react-admin';

import { useTranslate } from 'react-admin';

import { dateFormat } from '@/functions';
import { List, ReactAdminJalaliDateInput, SimpleForm } from '@/components';

const validateUserCreation = (values) => {
  const errors = {};
  if (!values.parent) {
    values.parent = {};
  }
  if (values.parent == '') {
    values.parent = {};
  }
  // if (!values.age) {
  //   // You can return translation keys
  //   errors.age = 'ra.validation.required';
  // } else if (values.age < 18) {
  //   // Or an object if the translation messages need parameters
  //   errors.age = {
  //     message: 'ra.validation.minValue',
  //     args: { min: 18 }
  //   };
  // }
  return errors;
};

export const customerEdit = (props) => {
  console.log('props', props);
  const translate = useTranslate();

  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput
          fullWidth
          disabled
          source="id"
          label={translate('resources.customers._id')}
        />
        <TextInput
          fullWidth
          source="firstName"
          label={translate('resources.customers.firstName')}
        />
        <TextInput
          fullWidth
          source="lastName"
          label={translate('resources.customers.lastName')}
        />
        <TextInput
          fullWidth
          source="internationalCode"
          label={translate('resources.customers.internationalCode')}
        />
        <TextInput
          fullWidth
          source="email"
          type="email"
          label={translate('resources.customers.email')}
        />
        <TextInput
          fullWidth
          source="companyName"
          type="text"
          label={translate('resources.customers.companyName')}
        />
        <TextInput
          fullWidth
          source="companyTelNumber"
          type="text"
          label={translate('resources.customers.companyTelNumber')}
        />
        <TextInput
          fullWidth
          source="phoneNumber"
          label={translate('resources.customers.phoneNumber')}
        />
        <TextInput
          fullWidth
          source="countryCode"
          label={translate('resources.customers.countryCode')}
        />
        <TextInput
          fullWidth
          source="activationCode"
          label={translate('resources.customers.activationCode')}
        />
        <TextInput
          fullWidth
          source="source"
          label={translate('resources.customers.source')}
        />
        <TextInput
          fullWidth
          source="birthday"
          label={translate('resources.customers.birthday')}
        />
        <TextInput
          fullWidth
          multiline
          source="data"
          label={translate('resources.customers.data')}
        />
        <ArrayInput source="address">
          <SimpleFormIterator {...props}>
            <TextInput fullWidth source={'City'} label="City" />
            <TextInput fullWidth source={'PostalCode'} label="PostalCode" />
            <TextInput fullWidth source={'State'} label="State" />
            <TextInput
              fullWidth
              source={'StreetAddress'}
              label="StreetAddress"
            />
          </SimpleFormIterator>
        </ArrayInput>

        <ReactAdminJalaliDateInput
          fullWidth
          source="birthdate"
          label={translate('resources.customers.birthdate')}
        />
        <SelectInput
          fullWidth
          label={translate('resources.customers.sex')}
          defaultValue={''}
          source="sex"
          choices={[
            { id: '', name: '' },
            { id: 'male', name: translate('resources.customers.male') },
            { id: 'female', name: translate('resources.customers.female') },
          ]}
        />
        <SelectInput
          label={translate('resources.customers.source')}
          defaultValue={''}
          fullWidth
          source="source"
          choices={[
            { id: 'WEBSITE', name: translate('resources.customers.WEBSITE') },
            { id: 'CRM', name: translate('resources.customers.CRM') },
          ]}
        />
        <ReferenceArrayInput source="customerGroup" reference="customerGroup">
          <SelectArrayInput
            fullWidth
            label={translate('resources.customers.customerGroup')}
            optionText="name.fa"
          />
        </ReferenceArrayInput>
        <BooleanInput
          fullWidth
          source="active"
          label={translate('resources.customers.active')}
        />
      </SimpleForm>
    </Edit>
  );
};

export default customerEdit;
