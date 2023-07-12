import * as React from 'react';
import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Box, Card, CardActions, CircularProgress } from '@mui/material';

import {
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  useRefresh,
  Form,
  ImageField,
  ImageInput,
  SaveButton,
  TextInput,
  useNotify,
  useTranslate,
  SelectInput,
  ReferenceInput,
} from 'react-admin';

import API, { BASE_URL } from '@/functions/API';
import { ColorPicker, ShowImageField } from '@/components';
// import {  } from 'react-hook-form';
const Messages = (props) => {
  // console.clear()
  const refresh = useRefresh();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      messages: [],
    },
  });
  // const { setValue } = useFormContext();
  // const theTitle = useWatch({ name: "title" });

  // const {
  //   register,
  //   formState: { errors },
  // } = useFormContext();
  // register("title", { value: "data" });
  // console.log(watch("title"));
  // watch("title");
  // console.log("watch", watch('title'));

  const [loading, setLoading] = useState(false);
  let [counter, setCounter] = useState(0);
  // const [color, setColor] = React.useState({
  //   primaryColor: "#ee811d",
  //   secondaryColor: "#2d3488",
  //   textColor: "#000000",
  //   bgColor: "#ffffff",
  //   footerBgColor: "#ffffff"
  // });

  const [theData, setTheData] = React.useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  // const login = useLogin();
  // const location = useLocation();
  const setTheColor = (t, e) => {
    console.log(t, e);
    setValue(t, e);
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
  const handleUpload = (files) => {
    // let GalleryTemp = gallery;
    // console.log("hanfleUpload");
    let file = files[0];

    if (!file) return;
    setLoading(true);
    let formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);
    API.post('/settings/fileUpload', formData, {
      onUploadProgress: (e) => {
        // let p = Math.floor((e.loaded * 100) / e.total);
        // setProgress(p);
      },
    }).then((p) => {
      setLoading(false);
      console.log(p);
      window.location.reload();
      // refresh();/
      // setCounter(counter++);
      // setTheData({...theData})
      handleNotif('resources.settings.logoUploadedSuccessfully');
    });
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

    API.get('/settings/configuration')
      .then(({ data = {} }) => {
        setLoading(false);
        Object.keys(data).forEach((d) => {
          setValue(d, data[d]);
        });
        console.log(d);

        // setValue("title",data.title);
        setTheData(true);
        return data;
      })
      .catch((e) => {
        setLoading(false);
        setTheData(true);
      });
  };

  const handleChange = (t, value) => {
    setValue(t, value);
    // let obj={ ...theData };
    // obj[t]=value;
    //
    // setTheData(obj);
  };

  const onSubmit = (g) => {
    console.log('theData', g, getValues());
    // console.clear();
    let jso = {
      messages: g.messages,
    };
    console.log('jso', jso);

    // return;
    API.put('/settings/configuration', JSON.stringify(jso)).then(
      ({ data = {} }) => {
        setLoading(false);
        // setTheData(data);
        console.log('data', data);
        if (data.success) {
          handleNotif('resources.settings.UpdatedSuccessfully');
        } else {
          handleNotif('resources.settings.sthWrong', 'error');
        }
        return data;
      }
    );
  };

  if (!theData) {
    return <></>;
  }
  if (theData) {
    let { messages } = getValues();
    return (
      <Form
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
        redirect={false}>
        <Box>
          <Card sx={{ padding: '1em' }}>
            <div>{translate('resources.messages.help')}</div>
            <ReferenceInput
              label={translate('resources.messages.gateway')}
              source="smsgateway"
              reference="gateway"
              perPage={1000}
              allowEmpty>
              <SelectInput
                optionText={'title.' + translate('lan')}
                optionValue="id"
              />
            </ReferenceInput>

            <Box>
              <ArrayInput
                source="messages"
                label={translate('resources.messages.messages')}>
                <SimpleFormIterator {...props}>
                  <FormDataConsumer>
                    {({ getSource, scopedFormData }) => [
                      <div className={'mb-20'} />,

                      <TextInput
                        fullWidth
                        source={getSource('title')}
                        label={translate('resources.messages.title')}
                        record={scopedFormData}
                      />,
                      <TextInput
                        fullWidth
                        source={getSource('des')}
                        label={translate('resources.messages.text')}
                        record={scopedFormData}
                      />,
                    ]}
                  </FormDataConsumer>
                </SimpleFormIterator>
              </ArrayInput>
            </Box>
            <CardActions sx={{ padding: '0 1em 1em 1em' }}>
              <SaveButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                alwaysEnable
                redirect={false}
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

export default Messages;
