import {
  Create,
  ReferenceInput,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useTranslate,
  useNotify,
  useRedirect,
} from 'react-admin';
import React from 'react';

import { CustomResetViewsButton, List, SimpleForm } from '@/components';
import useStyles from '@/styles';
import { Val } from '@/Utils';
import API, { BASE_URL } from '@/functions/API';

var theID = null;
const transformUser = (data) => ({
  ...data,
  parent: {},
});
const PostEditToolbar = () => (
  <Toolbar>
    <SaveButton
      onSubmit={(e) => {
        save(e);
      }}
    />
  </Toolbar>
);

const Form = ({ children, ...rest }) => {
  const cls = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify('Added successfully');
    redirect('/customerGroup');
  };
  // {...rest}
  return (
    <SimpleForm
      toolbar={<PostEditToolbar />}
      onSubmit={(v) => save(v, onSuccess)}>
      {children}
      <TextInput
        source={'name.' + translate('lan')}
        label={translate('resources.category.name')}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <TextInput
        source="slug"
        label={translate('resources.category.slug')}
        validate={Val.req}
        formClassName={cls.f2}
        fullWidth
      />
      <ReferenceInput
        label={translate('resources.category.parent')}
        source="parent"
        reference="customerGroup"
        defaultValue={{}}
        perPage={1000}
        formClassName={cls.f2}>
        <SelectInput optionText={'name.' + translate('lan')} optionValue="id" />
      </ReferenceInput>
      {/*<NumberInput*/}
      {/*source="order"*/}
      {/*label={translate('resources.category.order')}*/}
      {/*fullWidth*/}
      {/*/>*/}
    </SimpleForm>
  );
};

function save(record, onSuccess) {
  if (record.parent == '') {
    delete record.parent;
    //     type = 'plusx';
    //     number = record.plusx;
  }

  API.post('/customerGroup/', JSON.stringify(record))
    .then(({ data = {} }) => {
      onSuccess();
    })
    .catch((err) => {
      console.log('error', err);
    });

  // }

  // return 0;
}

const create = (props) => {
  return (
    <Create {...props} redirect="list">
      <Form />
    </Create>
  );
};

export default create;
