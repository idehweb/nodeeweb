import * as React from 'react';
import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Box, Card, CardActions, CircularProgress } from '@mui/material';

import {
  Form,
  SaveButton,
  SelectInput,
  TextInput,
  useNotify,
  useRefresh,
  useTranslate,
} from 'react-admin';

import API, { BASE_URL } from '@/functions/API';
import { ColorPicker, ShowImageField } from '@/components';
// import { SelectInput } from 'react-admin';
// import {  } frsom 'react-hook-form';
const SubmitEntryStatus = (props) => {
  const { _id, theStatus } = props;
  // return JSON.stringify(status)
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
      status: '',
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

  const [childs, setChilds] = useState([]);
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

  // React.useEffect(() => {
  //   console.log("theData", theData);

  // setCombs(record);
  // }, [theData]);
  const getData = () => {
    //
    // setLoading(true);
    //
    API.get('/settings/formStatus')
      .then((response = {}) => {
        const { data } = response;
        setLoading(false);
        // Object.keys(data).forEach(d => {
        //   setValue(d, data[d]);
        // });
        setChilds(data);
        console.log('data', data);
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
      description: theData.description,
      status: theData.status,
    };
    console.log('jso', jso);

    // return;
    API.put('/entry/status/' + _id, JSON.stringify(jso)).then(
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

  React.useEffect(() => {
    getData();
  }, []);

  const returnStatus = (st) => {
    let rd = childs && childs.filter((x) => x.slug == st);
    if (rd && rd[0] && rd[0].title) return rd[0].title;
    else return JSON.stringify(st);
  };
  let co = 0;
  if (theStatus) {
    co = theStatus.length;
  }

  if (!theData) {
    return <></>;
  }
  if (theData) {
    let { title, status } = getValues();
    return (
      <div>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
          redirect={false}>
          <Box>
            <Card sx={{ padding: '1em' }}>
              <Box>
                {childs ? (
                  <SelectInput
                    source="status"
                    onChange={(event) => {
                      console.log('event.target', event);
                      handleChange('status', event.target.value);
                    }}
                    choices={childs}
                    optionText={'title'}
                    optionValue={'slug'}
                    allowEmpty={false}
                  />
                ) : (
                  <span>Loadding...</span>
                )}

                <TextInput
                  autoFocus
                  fullWidth
                  label={translate('resources.settings.description')}
                  source={'description'}
                  disabled={loading}
                  defaultValue={title}
                  onChange={(event) => {
                    handleChange('description', event.target.value);
                  }}
                />
                {/*<SelectInput optionText={"title."+translate("lan")}*/}
                {/*defaultValue={home}*/}
                {/*onChange={(event) => {*/}
                {/*handleChange("home", event.target.value);*/}
                {/*}}*/}
                {/*/>*/}
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
        <div className={'item-box-parent'}>
          {/*{JSON.stringify(status)}*/}
          {theStatus &&
            theStatus.reverse().map((item, i) => {
              return (
                <div className={'item-boxes'}>
                  <span className={'child-item-boxes-f'}>
                    <span className={'child-item-boxes-f-c'}>
                      {'#' + (co - i)}
                    </span>
                    <span className={'child-item-boxes-f-d'}>
                      {returnStatus(item.status)}
                    </span>
                  </span>

                  <span className={'child-item-boxes-t'}>
                    {item.description}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
};

export default React.memo(SubmitEntryStatus);
