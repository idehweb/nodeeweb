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
  SelectInput,
  ReferenceInput,
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
      title: '',
      description: '',
      primaryColor: '#ee811d',
      secondaryColor: '#2d3488',
      textColor: '#000000',
      bgColor: '#ffffff',
      footerBgColor: '#ffffff',
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
        // console.log(d);

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

  const onSubmit = (theData) => {
    // console.clear();
    let jso = {
      logo: theData.logo,
      title: theData.title,
      description: theData.description,
      home: theData.home,
      header_last: theData.header_last,
      body_first: theData.body_first,
      primaryColor: theData.primaryColor,
      secondaryColor: theData.secondaryColor,
      textColor: theData.textColor,
      bgColor: theData.bgColor,
      footerBgColor: theData.footerBgColor,
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
    let {
      _id,
      logo,
      title = {},
      description = {},
      ADMIN_ROUTE,
      BASE_URL,
      SHOP_URL,
      ADMIN_URL,
      home,
      primaryColor,
      secondaryColor,
      bgColor,
      textColor,
      footerBgColor,
      ZIBAL_TOKEN,
      header_last,
      body_first,
    } = getValues();
    return (
      <Form
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
        redirect={false}>
        <Box>
          <Card sx={{ padding: '1em' }}>
            <Box>
              <Box>
                <div className={'row'}>
                  <div className={'col-md-3'}>
                    <label className={'the-label2'}>
                      {translate('resources.settings.currentLogo')}
                    </label>
                    {logo && (
                      <ShowImageField
                        photo={logo}
                        className={'width100'}
                        deleteFunction={false}
                      />
                    )}
                  </div>
                  <div className={'col-md-9'}>
                    <ImageInput
                      className={'the-label2 show-image-uploader'}
                      source={'logo'}
                      label={translate('resources.settings.uploadLogo')}
                      accept="image/*"
                      options={{
                        onDrop: handleUpload,
                      }}>
                      <ImageField source="src" title="title" />
                    </ImageInput>
                  </div>
                </div>
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  fullWidth
                  label={translate('resources.settings.title')}
                  source={'title.' + translate('lan')}
                  disabled={loading}
                  defaultValue={title[translate('lan')]}
                  onChange={(event) => {
                    handleChange(
                      'title.' + translate('lan'),
                      event.target.value
                    );
                  }}
                />
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  fullWidth
                  label={translate('resources.settings.description')}
                  source={'description.' + translate('lan')}
                  disabled={loading}
                  defaultValue={description[translate('lan')]}
                  onChange={(event) => {
                    handleChange(
                      'description.' + translate('lan'),
                      event.target.value
                    );
                  }}
                />
              </Box>
              <Box>
                <ReferenceInput
                  perPage={100}
                  label={translate('resources.settings.home')}
                  source="home"
                  reference="page"
                  alwaysOn>
                  <SelectInput
                    optionText={'title.' + translate('lan')}
                    defaultValue={home}
                    onChange={(event) => {
                      handleChange('home', event.target.value);
                    }}
                  />
                </ReferenceInput>
                {/*<SelectInput optionText={"title."+translate("lan")}*/}
                {/*defaultValue={defaultSiteLan}*/}
                {/*onChange={(event) => {*/}
                {/*handleChange("defaultSiteLan", event.target.value);*/}
                {/*}}*/}
                {/*/>*/}
                {/*<TextInput*/}
                {/*autoFocus*/}
                {/*fullWidth*/}
                {/*label={translate("resources.settings.home")}*/}
                {/*source="home"*/}
                {/*disabled={loading}*/}
                {/*defaultValue={''}*/}
                {/*onChange={(event) => {*/}
                {/*handleChange("home", event.target.value);*/}
                {/*}}*/}
                {/*/>*/}
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  source="header_last"
                  className={'ltr'}
                  multiline
                  label={'header_last'}
                  disabled={loading}
                  // validate={required()}
                  fullWidth
                  defaultValue={header_last}
                  onChange={(event) => {
                    handleChange('header_last', event.target.value);
                  }}
                />
              </Box>
              <Box>
                <TextInput
                  autoFocus
                  source="body_first"
                  className={'ltr'}
                  multiline
                  label={'body_first'}
                  disabled={loading}
                  // validate={required()}
                  fullWidth
                  defaultValue={body_first}
                  onChange={(event) => {
                    handleChange('body_first', event.target.value);
                  }}
                />
              </Box>
              <Box>
                <div className={'row'}>
                  <div className={'col-md-2'}>
                    <label className={'the-label2'}>
                      {translate('resources.settings.primaryColor')}
                    </label>
                    <ColorPicker
                      className={'input-color'}
                      source={'primaryColor'}
                      color={primaryColor}
                      onChangeComplete={(e) => setTheColor('primaryColor', e)}
                      placement="right"
                    />
                  </div>
                  <div className={'col-md-2'}>
                    <label className={'the-label2'}>
                      {translate('resources.settings.secondaryColor')}
                    </label>
                    <ColorPicker
                      className={'input-color'}
                      source={'secondaryColor'}
                      color={secondaryColor}
                      onChangeComplete={(e) => setTheColor('secondaryColor', e)}
                      placement="right"
                    />
                  </div>
                  <div className={'col-md-2'}>
                    <label className={'the-label2'}>
                      {translate('resources.settings.textColor')}
                    </label>
                    <ColorPicker
                      className={'input-color'}
                      source={'textColor'}
                      color={textColor}
                      onChangeComplete={(e) => setTheColor('textColor', e)}
                      placement="right"
                    />
                  </div>
                  <div className={'col-md-2'}>
                    <label className={'the-label2'}>
                      {translate('resources.settings.bgColor')}
                    </label>
                    <ColorPicker
                      className={'input-color'}
                      source={'bgColor'}
                      color={bgColor}
                      onChangeComplete={(e) => setTheColor('bgColor', e)}
                      placement="right"
                    />
                  </div>
                  <div className={'col-md-2'}>
                    <label className={'the-label2'}>
                      {translate('resources.settings.footerBgColor')}
                    </label>
                    <ColorPicker
                      className={'input-color'}
                      source={'footerBgColor'}
                      color={footerBgColor}
                      onChangeComplete={(e) => setTheColor('footerBgColor', e)}
                      placement="right"
                    />
                  </div>
                  <div className={'col-md-2'}></div>
                </div>
              </Box>
              <Box></Box>
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

export default Configuration;
