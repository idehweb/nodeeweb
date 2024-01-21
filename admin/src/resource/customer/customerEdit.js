// @ts-nocheck
/* eslint-disable react-hooks/rules-of-hooks */
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

import useFetch from '@/hooks/useFetch';

import { ReactAdminJalaliDateInput, SimpleForm } from '@/components';

export const customerEdit = (props) => {
  console.log('props', props);
  const translate = useTranslate();

  const WebAppConfigData = useFetch({ requestQuery: '/config/system' });

  const consumerStatusChoices = WebAppConfigData.data
    ? WebAppConfigData.data.data.consumer_status
    : [];

  const EditCostumerStatus = () => {
    return (
      <ArrayInput source="status" label={'resources.settings.consumerStatus'}>
        <SimpleFormIterator>
          <SelectInput
            disable={WebAppConfigData.isLoading}
            source="status"
            choices={consumerStatusChoices.map((obj) => {
              return {
                id: obj.key,
                name: obj.value,
                value: obj.key,
              };
            })}
            label="Status Type"
          />
          <TextInput
            label={translate('resources.settings.description')}
            source="description"
            disable={WebAppConfigData.isLoading}
          />
        </SimpleFormIterator>
      </ArrayInput>
    );
  };

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
        <EditCostumerStatus />
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
          source="phone"
          label={translate('resources.customers.phone')}
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
            <TextInput fullWidth source={'city'} label="City" />
            <TextInput fullWidth source={'postalCode'} label="PostalCode" />
            <TextInput fullWidth source={'state'} label="State" />
            <TextInput fullWidth source={'street'} label="StreetAddress" />
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
