import {
  Datagrid,
  DeleteButton,
  EditButton,
  Filter,
  FunctionField,
  Pagination,
  ReferenceField,
  SearchInput,
  TextField,
  useResourceContext,
  useTranslate,
} from 'react-admin';
import React from 'react';
import { Button } from '@mui/material';

import MessageIcon from '@mui/icons-material/Message';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { CustomResetViewsButton, List, SimpleForm } from '@/components';
import { Val } from '@/Utils';
import API, { BASE_URL } from '@/functions/API';
import CustomModal from '@/components/Modal';


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
        placeholder={translate('resources.category.name')}
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
          source={'name.' + translate('lan')}
          label={translate('resources.category.name')}
        />
        <TextField source="slug" label={translate('resources.category.slug')} />
        <ReferenceField
          label={translate('resources.category.parent')}
          source="parent"
          reference="category">
          <TextField source={'name.' + translate('lan')} />
        </ReferenceField>
        {/*<TextField source="order" label={translate('resources.category.order')}/>*/}
        <FunctionField
          label={translate('resources.customers.actions')}
          render={(record) => (
            <>
              <div key={'00'}>
                <EditButton />
              </div>
              <div key={'01'}>
                <Button
                  color="primary"
                  size="small"
                  key={'33'}
                  onClick={() => {
                    return (
                      <CustomModal
                        onClose={() => {}}
                        open={false}
                        className={'width50vw sdfghyjuikol kiuytgfhjuyt modal'}
                        title={'Choose Element'}>
                        <input />
                      </CustomModal>
                    );
                    // console.log('data', record._id);
                    // API.post("/product/copy/" + record._id, null)
                    //   .then(({ data = {} }) => {
                    //     // console.log('data', data._id);
                    //     props.history.push("/product/" + data._id);
                    //     // ale/rt('done');
                    //   })
                    //   .catch((err) => {
                    //     console.log("error", err);
                    //   });
                  }}>
                  <MessageIcon />
                  <span className={'ml-2 mr-2'}>
                    {translate('resources.customers.message')}
                  </span>
                </Button>
              </div>
              <div key={'02'}>
                <DeleteButton />
              </div>
            </>
          )}
        />

        {/*<EditButton/>*/}
        {/*<ShowButton/>*/}
      </Datagrid>
    </List>
  );
};

export default list;
