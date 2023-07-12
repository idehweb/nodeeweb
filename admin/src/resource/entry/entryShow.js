import {
  Show,
  TextInput,
  FunctionField,
  useEditController,
  SimpleShowLayout,
  useTranslate,
  TextField,
} from 'react-admin';

import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';

import React from 'react';
import Grid from '@mui/material/Grid';

import { EntryStatus } from '@/components';
import { dateFormat } from '@/functions';
import API, { BASE_URL } from '@/functions/API';

export const entryShow = (props) => {
  const translate = useTranslate();
  const { id } = useParams();
  let [formTitle, setFormTitle] = React.useState('');
  return (
    <Show {...props}>
      <Grid container spacing={2}>
        <Grid item lg={9} md={8} xs={12}>
          <SimpleShowLayout>
            <span>
              {formTitle ? formTitle : translate('resources.entry.data')}
            </span>
            <hr style={{ border: '3px solid #ddd' }} />
            <FunctionField
              render={(record) => {
                if (record.data) {
                  let fID = record.form;
                  API.get(BASE_URL + '/admin/form/' + fID)
                    .then((formData) => {
                      if (formData.data) {
                        setFormTitle(formData.data.title.fa);
                      }
                    })
                    .catch((err) => {
                      console.log('datadatadatadatadata', err);
                    });
                  return Object.keys(record.data).map((item) => {
                    if (item !== 'undefined') {
                      return (
                        <Box
                          style={{ marginBottom: '20px', marginTop: '20px' }}>
                          <span style={{ fontSize: '18px' }}>
                            {translate('resources.entry.' + item)}
                          </span>
                          <span style={{ padding: '0 10px' }}>:</span>
                          <span style={{ fontSize: '18px' }}>
                            {record.data[item]}
                          </span>
                        </Box>
                      );
                    }
                  });
                }
              }}
            />
          </SimpleShowLayout>
        </Grid>
        <Grid item lg={3} md={4} xs={12}>
          <FunctionField
            label={translate('resources.entry.tasks')}
            render={(record) => <EntryStatus record={record} />}
          />
        </Grid>
      </Grid>
    </Show>
  );
};

export default React.memo(entryShow);
