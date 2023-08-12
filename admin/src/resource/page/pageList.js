import {
  Datagrid,
  DeleteButton,
  EditButton,
  Filter,
  FunctionField,
  Pagination,
  SearchInput,
  TextField,
  useTranslate,
} from 'react-admin';

import { Button } from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import React from 'react';

import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField,
} from '@/components';
import { dateFormat } from '@/functions';
import API, { BASE_URL } from '@/functions/API';

const PostPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
);

const postRowStyle = (record, index) => {
  return {
    backgroundColor: '#ee811d',
  };
};

const PostFilter = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>
      <SearchInput
        source="Search"
        placeholder={translate('resources.page.search')}
        alwaysOn
      />
      <SearchInput
        source="category"
        placeholder={translate('resources.page.category')}
        alwaysOn
      />
    </Filter>
  );
};

const list = (props) => {
  const translate = useTranslate();
  // rowStyle={postRowStyle}
  return (
    <List {...props} filters={<PostFilter />} pagination={<PostPagination />}>
      <Datagrid optimized>
        <ShowLink
          source={'title.' + translate('lan')}
          label={translate('resources.page.title')}
          sortable={false}
          base={null}
        />
        <TextField source="slug" label={translate('resources.page.slug')} />
        <TextField source="path" label={translate('resources.page.path')} />

        <FunctionField
          label={translate('resources.page.date')}
          render={(record) => (
            <div className="theDate">
              <div>
                {translate('resources.page.createdAt') +
                  ': ' +
                  `${dateFormat(record.createdAt)}`}
              </div>
              <div>
                {translate('resources.page.updatedAt') +
                  ': ' +
                  `${dateFormat(record.updatedAt)}`}
              </div>

              {record.views && (
                <div>
                  {translate('resources.page.viewsCount') +
                    ': ' +
                    `${record.views.length}`}
                </div>
              )}
            </div>
          )}
        />
        <FunctionField
          label={translate('resources.page.actions')}
          render={(record) => (
            <div>
              <div>
                {/*+"?token="+localStorage.getItem('token')*/}
                <a
                  target={'_blank'}
                  href={'/admin/#/builder' + '/page/' + record._id} rel="noreferrer">
                  <NoteAltIcon />
                  <span className={'ml-2 mr-2'}>
                    {translate('resources.page.pagebuilder')}
                  </span>
                </a>
              </div>
              <div>
                <EditButton />
              </div>
              <div>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => {
                    // console.log('data', record._id);
                    API.post('/page/copy/' + record._id, null)
                      .then(({ data = {} }) => {
                        // console.log('data', data._id);
                        props.history.push('/post/' + data._id);
                        // ale/rt('done');
                      })
                      .catch((err) => {
                        console.log('error', err);
                      });
                  }}>
                  <ContentCopyIcon />
                  <span className={'ml-2 mr-2'}>
                    {translate('resources.page.copy')}
                  </span>
                </Button>
              </div>
              <div>
                <a
                  href={
                    '/#/action?filter=%7B%page"%3A"' +
                    record._id +
                    '"%7D&order=ASC&page=1&perPage=10&sort=id/'
                  }
                  target={'_blank'}
                  color="primary"
                  size="small"
                  onClick={() => {}} rel="noreferrer">
                  <PendingActionsIcon />
                  <span className={'ml-2 mr-2'}>
                    {translate('resources.page.activities')}
                  </span>
                </a>
              </div>
              {/*<div>*/}
              {/*<DeleteButton/>*/}
              {/*</div>*/}
            </div>
          )}
        />
      </Datagrid>
    </List>
  );
};

export default list;
