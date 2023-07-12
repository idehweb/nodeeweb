import * as React from 'react';
import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Box, Card, CardActions, CircularProgress } from '@mui/material';

import {
  useRefresh,
  Form,
  ImageField,
  ImageInput,
  SaveButton,
  TextInput,
  useNotify,
  useTranslate,
} from 'react-admin';

import API, { BASE_URL } from '@/functions/API';
import { ColorPicker, ShowImageField } from '@/components';
// import {  } from 'react-hook-form';
const Configuration = (props) => {
  const refresh = useRefresh();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      BASE_URL: window.BASE_URL,
      SHOP_URL: window.SHOP_URL,
      ADMIN_URL: window.ADMIN_URL,
      ADMIN_ROUTE: window.ADMIN_ROUTE,
    },
  });

  const [loading, setLoading] = useState(false);
  let [counter, setCounter] = useState(0);

  const [theData, setTheData] = React.useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  // const login = useLogin();
  // const location = useLocation();
  const setTheColor = (t, e) => {
    console.log(t, e);
    // setValue(t, e.hex);
    // setCounter(counter++);
    // console.log("getValuszses", getValues());
    // color[t] = e.hex;
    // console.log('{...color}',{...color});
    // setColor({ ...color });
  };
  const setTheValue = (e) => {
    console.log(e.target.value);
  };
  const handleNotif = (t, type = 'success') => {
    notify(t, { type: type });
  };
  React.useEffect(() => {
    console.log('getData', getData());

    // setCombs(record);
  }, []);
  // React.useEffect(() => {
  //   console.log("theData", theData);

  // setCombs(record);
  // }, [theData]);
  const getData = () => {
    setLoading(true);
    setTheData({
      BASE_URL: 'hi',
      SHOP_URL: 'hi',
      ADMIN_URL: 'hi',
      ADMIN_ROUTE: 'hi',
    });
    setLoading(false);

    // API.get("/settings/configuration").then(({ data = {} }) => {
    //   setLoading(false);
    //   Object.keys(data).forEach(d => {
    //     setValue(d, data[d]);
    //   });
    //   // console.log(d);
    //
    //   // setValue("title",data.title);
    //   setTheData(true);
    //   return data;
    // }).catch(e=>{
    //   setLoading(false);
    //   setTheData(true);
    // });
  };

  const handleChange = (t, value) => {
    setValue(t, value);
    // let obj={ ...theData };
    // obj[t]=value;
    //
    // setTheData(obj);
  };

  const onSubmit = (theData) => {
    console.clear();
    console.log('data', theData);

    API.put('/settings/pc', JSON.stringify(theData)).then(({ data = {} }) => {
      setLoading(false);
      // setTheData(data);
      console.log('data', data);
      if (data.success) {
        handleNotif('resources.settings.UpdatedSuccessfully');
      } else {
        handleNotif('resources.settings.sthWrong', 'error');
      }
      return data;
    });
  };

  if (!theData) {
    return <></>;
  }
  if (theData) {
    let { ADMIN_ROUTE, BASE_URL, SHOP_URL, ADMIN_URL } = getValues();
    return (
      <Form onSubmit={handleSubmit(onSubmit)} noValidate {...props}>
        <Box>
          <Card sx={{ padding: '1em' }}>
            <Box>
              <Box>
                <TextInput
                  autoFocus
                  className={'ltr'}
                  source="BASE_URL"
                  label={'BASE_URL'}
                  disabled={loading}
                  helperText={window.BASE_URL}
                  // validate={required()}
                  fullWidth
                  defaultValue={BASE_URL}
                  onChange={(event) => {
                    handleChange('BASE_URL', event.target.value);
                  }}
                />
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  className={'ltr'}
                  source="SHOP_URL"
                  label={'SHOP_URL'}
                  disabled={loading}
                  helperText={window.SHOP_URL}
                  // validate={required()}
                  fullWidth
                  defaultValue={SHOP_URL}
                  onChange={(event) => {
                    handleChange('SHOP_URL', event.target.value);
                  }}
                />
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  className={'ltr'}
                  source="ADMIN_URL"
                  label={'ADMIN_URL'}
                  disabled={loading}
                  // validate={required()}
                  fullWidth
                  helperText={window.ADMIN_URL}
                  defaultValue={ADMIN_URL}
                  onChange={(event) => {
                    handleChange('ADMIN_URL', event.target.value);
                  }}
                />
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  source="ADMIN_ROUTE"
                  className={'ltr'}
                  label={'ADMIN_ROUTE'}
                  disabled={loading}
                  // validate={required()}
                  helperText={window.ADMIN_ROUTE}
                  fullWidth
                  defaultValue={ADMIN_ROUTE}
                  onChange={(event) => {
                    handleChange('ADMIN_ROUTE', event.target.value);
                  }}
                />
              </Box>
            </Box>
            <CardActions sx={{ padding: '0 1em 1em 1em' }}>
              <SaveButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                alwaysEnable
                // saving={onSubmit}
              >
                {loading && <CircularProgress size={25} thickness={2} />}
                {translate('resources.settings.save')}
              </SaveButton>
            </CardActions>
          </Card>
        </Box>
      </Form>
    );
  }
};

export default Configuration;
