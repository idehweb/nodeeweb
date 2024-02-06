import {
  AutocompleteInput,
  ChipField,
  Datagrid,
  Filter,
  FunctionField,
  ReferenceInput,
  Pagination,
  ShowButton,
  TextField,
  useTranslate,
} from 'react-admin';

import { dateFormat } from '@/functions';
import { JsonDiffer, List, SimpleForm, UploaderField } from '@/components';
import { Val } from '@/Utils';
// import { useTranslate } from "react-admin";
// import {deepEqual} from 'deep-equal';
const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);

const list = (props) => {
  const translate = useTranslate();
  return (
    <List
      {...props}
      filters={
        <Filter {...props}>
          <ReferenceInput
            label={translate('resources.action.user')}
            // source={translate('resources.action.user')}
            source="user"
            reference="admin"
            sort={{ field: '_id', order: 'ASC' }}
            filterToQuery={(searchText) => ({ _id: searchText })}
            alwaysOn>
            <AutocompleteInput optionText="username" />
          </ReferenceInput>
          <ReferenceInput
            label={translate('resources.action.product')}
            source="product"
            reference="product"
            sort={{ field: '_id', order: 'ASC' }}
            filterToQuery={(searchText) => ({ _id: searchText })}
            alwaysOn>
            <AutocompleteInput optionText="title.fa" />
          </ReferenceInput>
          <ReferenceInput
            label={translate('resources.action.customer')}
            source="customer"
            reference="customer"
            sort={{ field: '_id', order: 'ASC' }}
            filterToQuery={(searchText) => ({ q: searchText })}
            alwaysOn>
            <AutocompleteInput optionText="firstName" />
          </ReferenceInput>
        </Filter>
      }
      pagination={<PostPagination />}>
      <Datagrid>
        <FunctionField
          label={translate('resources.action.user')}
          render={(record) => {
            return (
              <div className={'categories'}>
                {record.doer && (
                  <div>
                    <ChipField
                      source="doer.firstName"
                      label={translate('resources.action.username')}
                      sortable={false}
                    />
                    {/* {record.doer.firstName && (
                      <ChipField
                        source="doer.firstName"
                        label={translate('resources.action.firstName')}
                        sortable={false}
                      />
                    )}
                    {record.doer.lastName && (
                      <ChipField
                        source="doer.lastName"
                        label={translate('resources.action.lastName')}
                        sortable={false}
                      />
                    )} */}
                  </div>
                )}
              </div>
            );
          }}
        />
        <FunctionField
          label={translate('resources.action.customer')}
          render={(record) => {
            return (
              <div className={'categories'}>
                {/* {record.customer && ( */}
                {record.doer && (
                  <div>
                    {/* <ChipField
                      source="doer.phoneNumber"
                      label={translate('resources.action.phoneNumber')}
                      sortable={false}
                    /> */}
                    <ChipField
                      source="doer.firstName"
                      label={translate('resources.action.firstName')}
                      sortable={false}
                    />
                    <ChipField
                      source="doer.lastName"
                      label={translate('resources.action.lastName')}
                      sortable={false}
                    />
                  </div>
                )}
              </div>
            );
          }}
        />
        <TextField
          source="target.model"
          label={translate('resources.action.title')}
        />

        <FunctionField
          label={translate('resources.action.createdAt')}
          render={(record) =>
            `${record.createdAt ? dateFormat(record.createdAt) : ''}`
          }
        />

        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default list;
