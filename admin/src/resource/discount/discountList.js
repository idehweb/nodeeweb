import {
  BulkDeleteButton,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  Filter,
  FunctionField,
  NumberInput,
  Pagination,
  ReferenceField,
  ReferenceInput,
  ResourceContextProvider,
  SearchInput,
  SelectInput,
  Show,
  ShowButton,
  SimpleShowLayout,
  TextField,
  TextInput,
  useResourceContext,
  useTranslate,
} from 'react-admin';
import React, { Fragment } from 'react';
import { useParams } from 'react-router';
import { CategoryRounded as Icon, LibraryAdd } from '@mui/icons-material';

import { Chip } from '@mui/material';

import { CustomResetViewsButton, List, SimpleForm } from '@/components';
import useStyles from '@/styles';
import { Val } from '@/Utils';
import API, { BASE_URL } from '@/functions/API';

var theID = null;
const ResourceName = () => {
  const { resource } = useResourceContext();
  return <>{resource}</>;
};
const PostFilter = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>
      {/*<TextInput label="Search" source="search" alwaysOn/>*/}
      <SearchInput
        source="Search"
        placeholder={translate('resources.discount.name')}
        alwaysOn
      />
      {/*<SearchInput source="firstCategory" placeholder={'نام'} alwaysOn/>*/}
      {/*<SearchInput source="lastName" placeholder={'نام خانوادگی'} alwaysOn/>*/}
      {/*<SelectInput source="firstCategory" label={'دسته بندی اول'}  emptyValue={null} choices={typeChoices4}/>*/}
      {/*<SelectInput source="secondCategory" label={'دسته بندی دوم'}  emptyValue={null} choices={typeChoices3}/>*/}
      {/*<SelectInput source="thirdCategory" label={'دسته بندی سوم'}  emptyValue={null} choices={typeChoices3}/>*/}
    </Filter>
  );
};
const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200, 500]} {...props} />
);

const list = (props) => {
  const translate = useTranslate();

  return (
    <List {...props} filters={<PostFilter />} pagination={<PostPagination />}>
      <Datagrid>
        <TextField
          source='code'
          label={translate('resources.discount.code')}
        />
        <TextField
          source="amount"
          label={translate('resources.discount.amount')}
        />
        <TextField
          source="usageLimit"
          label={translate('resources.discount.usageLimit')}
        />
        {/* <TextField
          source="price"
          label={translate('resources.discount.price')}
        /> */}
        {/* <TextField
          source="percent"
          label={translate('resources.discount.percent')}
        />
        <TextField
          source="customerLimit"
          label={translate('resources.discount.customerLimit')}
        /> */}
        {/*<ReferenceField*/}
        {/*label={translate('resources.discount.parent')}*/}
        {/*source="parent"*/}
        {/*reference="category">*/}
        {/*<TextField source={"name."+translate('lan')}/>*/}
        {/*</ReferenceField>*/}
        {/*<TextField source="order" label={translate('resources.discount.order')}/>*/}

        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default list;
