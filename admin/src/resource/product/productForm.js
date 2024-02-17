//@ts-check

import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrayInput,
  BooleanInput,
  DeleteButton,
  FormDataConsumer,
  NumberInput,
  ReferenceArrayInput,
  SaveButton,
  SelectArrayInput,
  SelectInput,
  SimpleFormIterator,
  CheckboxGroupInput,
  TextInput,
  Toolbar,
  useNotify,
  useRedirect,
  useTranslate,
  useGetList,
  Button,
} from 'react-admin';

// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import { StyledMenu, GPTButton } from './ChatGPTButtonStyle';

import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import {
  useFormContext,
  useForm,
  useController,
  useFormState,
} from 'react-hook-form';
import Input from '@mui/material/Input';
import axios from 'axios';

import { RichTextInput } from 'ra-input-rich-text';

import API from '@/functions/API';
import { dateFormat } from '@/functions';
import {
  AtrRefField,
  CatRefField,
  Combinations,
  EditOptions,
  FileChips,
  FormTabs,
  List,
  ProductType,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  StockStatus,
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';
import Transform from '@/functions/transform';
import { convertError } from '@/functions/utils';

import { FunctionField } from 'react-admin';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

// import { RichTextInput } from 'ra-input-rich-text';
// import {ImportButton} from "react-admin-import-csv";
let combs = [];

let valuess = { photos: [], files: [], thumbnail: '', combinations: [] };

function setPhotos(values) {
  // let {values} = useFormState();
  valuess['photos'] = values;
  // setV(!v);
  // this.forceUpdate();
}

function returnToHome(values) {
  if (values['firstCategory'])
    valuess['firstCategory'] = values['firstCategory'];
  if (values['secondCategory'])
    valuess['secondCategory'] = values['secondCategory'];
  if (values['thirdCategory'])
    valuess['thirdCategory'] = values['thirdCategory'];
}

function onCreateCombinations(options) {
  let combCount = 1;
  let combinationsTemp = [];
  let combinations = [];
  let counter = 0;
  options.forEach((opt, key) => {
    let optemp = {};
    let theVals = [];
    opt.values.forEach((val, key2) => {
      theVals.push({ [opt.name]: val.name });
    });
    combinationsTemp.push(theVals);
  });

  let ttt = cartesian(combinationsTemp);

  ttt.forEach((tt, key) => {
    let obj = {};
    tt.forEach((ther, key) => {
      // obj[key]=ther;
      Object.assign(obj, ther);
    });
    combinations.push({
      id: key,
      options: obj,
      in_stock: false,
      price: null,
      salePrice: null,
      quantity: 0,
    });
  });
  // (id, path, rowRecord) => form.change('combinations', combinations)

  combs = combinations;
  return combinations;
}

function cartesian(args) {
  let r = [],
    max = args.length - 1;

  function helper(arr, i) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      let a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }

  helper([], 0);
  return r;
}

function returnCatsValues() {
  return {
    firstCategory: valuess['firstCategory'],
    secondCategory: valuess['secondCategory'],
    thirdCategory: valuess['thirdCategory'],
  };
}

function theP(values) {
  valuess['thumbnail'] = values;
}

function thelF(values) {
  valuess['files'].push({
    url: values,
  });
}

function CombUpdater(datas) {
  valuess['combinations'] = datas;
}

function OptsUpdater(datas) {
  valuess['options'] = datas;
}

const CustomToolbar = (props) => {
  const notify = useNotify();
  const { reset } = useFormContext();
  const redirect = useRedirect();

  const transform = (data, { previousData }) => {
    if (valuess.firstCategory) {
      valuess.firstCategory = valuess.firstCategory;
    }
    if (valuess.secondCategory) {
      valuess.secondCategory = valuess.secondCategory;
    }
    if (valuess.thirdCategory) {
      valuess.thirdCategory = valuess.thirdCategory;
    }
    if (valuess.thumbnail) {
      valuess.thumbnail = valuess.thumbnail;
    }

    return valuess;
  };
  let { record } = props;

  return (
    <Toolbar {...props} className={'dfghjk'}>
      <SaveButton
        alwaysEnable
        edit={'edit'}
        mutationMode={'pessimistic'}
        transform={transform}
      />
      <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
  );
};
const Form = ({ children, ...props }) => {
  const { record } = props;
  const [photos, setPhotos] = useState(record?.photos ?? []);
  const [thumbnail, setThumbnail] = useState(record?.thumbnail);
  const [checkPrice, setCheckPrice] = useState('');

  let _The_ID = '';
  const translate = useTranslate();
  const notify = useNotify();

  const onAddPhoto = useCallback(async ({ _id, url }) => {
    setPhotos((photos) => {
      if (photos.find((p) => p._id === _id)) return photos;
      return [...photos, { _id, url }];
    });
  }, []);

  const onRemovePhoto = useCallback((url) => {
    setPhotos((photos) => photos.filter((p) => p.url !== url));
  }, []);
  const changeThumbnail = useCallback(async (url) => {
    setThumbnail(url);
  }, []);

  if (record && record._id) {
    _The_ID = record._id;
  }
  if (record && record.photos) {
    valuess['photos'] = record.photos;
  }
  if (record && record.thumbnail) {
    valuess['thumbnail'] = record.thumbnail;
  }
  // const {reset} = useFormContext();
  const redirect = useRedirect();
  const transform = (data, { previousData }) => {
    return {
      ...data,
      // firstCategory: "61d58e37d931414fd78c7fb7"
    };
  };

  function save(values) {
    values.photos = photos;
    values.thumbnail = thumbnail;

    if (_The_ID.length > 0) {
      // delete values.photos;
      delete values.questions;
      delete values.nextproduct;
      delete values.category;
      delete values.catChoosed;
      delete values.files;

      const product = Transform.updateProduct(values);
      API.put('/product/' + _The_ID, JSON.stringify(product))
        .then(({ data = {} }) => {
          notify('saved');
          if (data) {
            values = [];
          }
        })
        .catch((err) => {
          notify(convertError(err), { type: 'error', multiLine: true });
        });
    } else {
      const product = Transform.createProduct(values);
      API.post('/product/', JSON.stringify(product))
        .then(({ data = {} }) => {
          if (data) {
            _The_ID = '';
            redirect('/product');
          }
        })
        .catch((err) => {
          notify(convertError(err), { type: 'error', multiLine: true });
        });
    }
  }
  let ST = StockStatus() || [];
  ST.map((item) => {
    item.id = item.value;
    item.name = item.label;
    // delete item.value;
    // delete item.label;
    return item;
  });

  const totals = 0;

  const [waitings, setWaitings] = useState(false);

  // const [anchorEl, setAnchorEl] = React.useState(null);

  const { setValue, getValues } = useForm({
    defaultValues: {
      mainWord: props?.record?.title?.fa,
      chatGPTanswerForExcerpt: props?.record?.excerpt?.fa,
      chatGPTanswerForDescription: props?.record?.description?.fa,
      chatGPTanswerForMetadescription: props?.record?.metadescription?.fa,
    },
  });
  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleChange = (t, value) => {
    setValue(t, value);
  };

  const chatGptHandler = async (e) => {
    // e.preventDefault();
    // handleClose();
    try {
      let question;
      const expr = e.target.id;
      switch (expr) {
        case 'excerpt':
          question = getValues('mainWord')
            ? `tell me about ${getValues('mainWord').trim()} in 40 words`
            : props.record?.title.fa
            ? `tell me about ${props.record.title.fa} in 40 words`
            : null;
          break;
        case 'metadescription':
          question = getValues('mainWord')
            ? `give me a meta description about ${getValues(
                'mainWord'
              ).trim()} in 60 words`
            : props.record?.title.fa
            ? `give me a meta description about ${props.record.title.fa} in 60 words `
            : null;
          break;
        case 'description':
          question = getValues('mainWord')
            ? `tell me about ${getValues(
                'mainWord'
              ).trim()} in 100 words in order to introduce it to the customer for sale purposes`
            : props.record?.title.fa
            ? `tell me about ${props.record.title.fa} in 100 words in order to introduce it to the customer for sale purposes`
            : null;
          break;
        default:
          console.log(`Sorry, There is no question`);
      }

      if (!question) {
        notify('Please enter a title');
        return;
      }

      var myHeaders = new Headers();

      myHeaders.append(
        'content-type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      );
      var raw = `content=${question}`;

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      setWaitings(true);
      const data = await fetch(
        'https://idehweb.com/chatgpt/gpt.php',
        requestOptions
      );

      const response = await data.json();
      const formatedData = await response.choices[0].message.content;
      setWaitings(false);

      switch (expr) {
        case 'excerpt':
          handleChange('chatGPTanswerForExcerpt', formatedData);
          break;
        case 'metadescription':
          handleChange('chatGPTanswerForMetadescription', formatedData);
          break;
        case 'description':
          handleChange('chatGPTanswerForDescription', formatedData);
          break;

        default:
          console.log(`there is no response.`);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const ControlledTextInput = ({ value, ...props }) => {
    const { setValue } = useFormContext();

    React.useEffect(() => {
      setValue(props.source, value);
      //eslint-disable-next-line
    }, [value]);

    return <TextInput {...props} />;
  };

  const ControlledRichTextInput = ({ value, ...props }) => {
    const { setValue } = useFormContext();

    React.useEffect(() => {
      setValue(props.source, value);
      //eslint-disable-next-line
    }, [value]);

    return <RichTextInput {...props} />;
  };

  return (
    <SimpleForm
      {...props}
      transform={transform}
      onSubmit={(v) => save(v)}
      toolbar={<CustomToolbar record={props.record} />}>
      {children}

      {/* <div>
        <GPTButton
          disabled={waitings}
          startIcon={
            waitings ? (
              <CircularProgress style={{ width: '20px', height: '20px' }} />
            ) : (
              <ArrowDropDownIcon />
            )
          }
          onClick={handleClick}>
          ASK CHATGPT FOR
        </GPTButton>
        <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem id="metadescription" onClick={(e) => chatGptHandler(e)}>
            {translate('resources.product.metadescription')}
          </MenuItem>
          <MenuItem id="excerpt" onClick={(e) => chatGptHandler(e)}>
            {translate('resources.product.excerpt')}
          </MenuItem>
          <MenuItem id="description" onClick={(e) => chatGptHandler(e)}>
            {translate('resources.product.description')}
          </MenuItem>
        </StyledMenu>
      </div> */}

      <TextInput
        source={'title.' + translate('lan')}
        label={translate('resources.product.title')}
        className={'width100 mb-20'}
        onChange={(e) => {
          setValue('mainWord', e.target.value);
        }}
        validate={Val.req}
        fullWidth
      />

      <TextInput
        source="slug"
        label={translate('resources.product.slug')}
        className={'width100 mb-20 ltr'}
        fullWidth
        validate={Val.req}
      />
      <TextInput
        fullWidth
        source={'metatitle.' + translate('lan')}
        label={translate('resources.product.metatitle')}
      />
      <div className={'gpt-button-wrap'}>
        <ControlledTextInput
          fullWidth
          multiline
          source={'metadescription.' + translate('lan')}
          value={getValues('chatGPTanswerForMetadescription')}
          label={translate('resources.product.metadescription')}
        />
        {waitings ? (
          <CircularProgress className={'gpt-btn-circular'} />
        ) : (
          <GPTButton
            className={'gpt-button'}
            disabled={waitings}
            id="metadescription"
            onClick={(e) => chatGptHandler(e)}>
            <span>ASK CHATGPT</span>
          </GPTButton>
        )}
      </div>

      <div className={'gpt-button-wrap'}>
        <ControlledTextInput
          fullWidth
          multiline
          source={'excerpt.' + translate('lan')}
          value={getValues('chatGPTanswerForExcerpt')}
          label={translate('resources.product.excerpt')}
        />
        {waitings ? (
          <CircularProgress className={'gpt-btn-circular'} />
        ) : (
          <GPTButton
            className={'gpt-button'}
            disabled={waitings}
            id="excerpt"
            onClick={(e) => chatGptHandler(e)}>
            <span>ASK CHATGPT</span>
          </GPTButton>
        )}
      </div>

      {/* <Button
        label="Ask chatGPT"
        type="button"
        onClick={(e) => {
          chatGptHandler(e);
        }}
        style={{ border: '1px solid', borderRadius: 10, margin: 2 }}
      />
      {waitings && (
        <Box
          sx={{
            display: 'flex',
            padding: '10px',
            margin: '10px',
          }}>
          <CircularProgress />
        </Box>
      )} */}
      {/* {answer != '' && !waitings && (
                <TextField
                  label="chatGPT answer"
                  color="secondary"
                  style={{ width: '100%', padding: '5px', margin: '5px' }}
                  multiline
                  value={answer}
                />
              )} */}

      <div className={'gpt-button-wrap'}>
        <ControlledRichTextInput
          fullWidth
          source={'description.' + translate('lan')}
          value={getValues('chatGPTanswerForDescription')}
          label={translate('resources.product.description')}
        />
        {waitings ? (
          <CircularProgress className={'gpt-btn-circular'} />
        ) : (
          <GPTButton
            className={'gpt-button'}
            disabled={waitings}
            id="description"
            onClick={(e) => chatGptHandler(e)}>
            <span>ASK CHATGPT</span>
          </GPTButton>
        )}
      </div>
      <div className={'mb-20'} />
      {/* <BooleanInput
        source="story"
        label={translate('resources.product.story')}
      />
      <BooleanInput
        source="requireWarranty"
        label={translate('resources.product.requireWarranty')}
      /> */}
      <TextInput
        source={'miniTitle.' + translate('lan')}
        label={translate('resources.product.miniTitle')}
      />
      {/* <TextInput
        source={'extra_button'}
        label={translate('resources.product.extra_button')}
      /> */}

      <ReferenceArrayInput
        label={translate('resources.product.productCategory')}
        perPage={100}
        source="productCategory"
        reference="productCategory">
        <SelectArrayInput optionText="name.fa" />
      </ReferenceArrayInput>

      <AtrRefField
        label={translate('resources.product.attributes')}
        source="attributes"
        reference="attributes"
        url={'/attributes/0/1000'}
        surl={'/attributes'}
      />

      <div className={'mb-20'} />

      <SelectInput
        label={translate('resources.product.type')}
        fullWidth
        className={'mb-20'}
        source="type"
        choices={ProductType()}
      />

      <div className={'mb-20'} />

      <FormDataConsumer>
        {({ formData = {}, ...rest }) => {
          if (formData.type === 'variable')
            return [
              <EditOptions
                source={'options'}
                key={0}
                record={formData}
                onCreateCombinations={onCreateCombinations}
                formData={formData}
                type={formData.type}
                updater={OptsUpdater}
              />,
              <Combinations
                key={1}
                record={formData}
                theST={ST}
                source="combinations"
                updater={() => {}}
              />,
            ];
          if (formData.type === 'normal')
            return [
              <div className={'row mb-20'} key={0}>
                <div className={'col-md-4'}>
                  <SelectInput
                    fullWidth
                    label={translate('resources.product.stock')}
                    // record={scopedFormData}
                    source={'in_stock'}
                    choices={ST}
                    // formClassName={cls.f2}
                    {...rest}
                  />
                </div>
                <div className={'col-md-4'}>
                  <NumberInput
                    fullWidth
                    source={'quantity'}
                    label={translate('resources.product.quantity')}
                    // record={scopedFormData}
                    {...rest}
                  />
                </div>
                <div className={'col-md-4'}>
                  <NumberInput
                    fullWidth
                    source={'weight'}
                    label={translate('resources.product.weight')}
                    // record={scopedFormData}
                    {...rest}
                  />
                </div>
              </div>,
              <div className={'row mb-20'} key={1}>
                <div className={'col-md-6'}>
                  <TextInput
                    fullWidth
                    // record={scopedFormData}

                    source={'price'}
                    validate={Val.num}
                    className={'ltr'}
                    label={translate('resources.product.price')}
                    format={(v) => {
                      if (!v) return '';
                      setCheckPrice(
                        v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      );
                      return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }}
                    parse={(v) => {
                      if (!v) return '';

                      return v.toString().replace(/,/g, '');
                    }}
                    {...rest}
                  />
                </div>
                <div className={'col-md-6'}>
                  <TextInput
                    fullWidth
                    // record={scopedFormData}

                    source={'salePrice'}
                    className={'ltr'}
                    label={translate('resources.product.salePrice')}
                    format={(v) => {
                      return !v
                        ? checkPrice
                        : v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }}
                    parse={(v) => {
                      if (!v) return '';

                      return v.toString().replace(/,/g, '');
                    }}
                    {...rest}
                  />
                </div>
              </div>,
              // <div className={'row mb-20'} key={2}>
              //   <div className={'col-md-3'}>
              //     <TextInput
              //       fullWidth
              //       // record={scopedFormData}

              //       source={'source'}
              //       className={'ltr'}
              //       label={translate('resources.product.source')}
              //       {...rest}
              //     />
              //   </div>
              //   <div className={'col-md-3'}>
              //     <TextInput
              //       fullWidth
              //       // record={scopedFormData}

              //       source={'minPrice'}
              //       className={'ltr'}
              //       label={translate('resources.product.minPrice')}
              //       format={(v) => {
              //         if (!v) return;

              //         return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              //       }}
              //       parse={(v) => {
              //         if (!v) return;

              //         return v.toString().replace(/,/g, '');
              //       }}
              //       {...rest}
              //     />
              //   </div>
              //   <div className={'col-md-3'}>
              //     <TextInput
              //       fullWidth
              //       // record={scopedFormData}

              //       source={'maxPrice'}
              //       className={'ltr'}
              //       label={translate('resources.product.maxPrice')}
              //       format={(v) => {
              //         if (!v) return;

              //         return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              //       }}
              //       parse={(v) => {
              //         if (!v) return;

              //         return v.toString().replace(/,/g, '');
              //       }}
              //       {...rest}
              //     />
              //   </div>
              //   <div className={'col-md-3'}>
              //     <TextInput
              //       fullWidth
              //       // record={scopedFormData}

              //       source={'formula'}
              //       className={'ltr'}
              //       label={translate('resources.product.formula')}
              //       {...rest}
              //     />
              //   </div>
              // </div>,
            ];
        }}
      </FormDataConsumer>

      {/*<EditOptions*/}
      {/*// record={record}*/}
      {/*onCreateCombinations={onCreateCombinations} updater={OptsUpdater}/>*/}

      {/*<ShowPictu  <EditOptions ros" thep={theP} setPhotos={setPhotos}/>*/}

      <UploaderField
        label={translate('resources.product.photo')}
        accept="image/*"
        source="photos"
        multiple={true}
        thep={theP}
        setPhotos={setPhotos}
        inReturn={onAddPhoto}
        onRemove={onRemovePhoto}
        changeThumbnail={changeThumbnail}
      />

      <div className={'mb-20'} />

      <ArrayInput
        source="extra_attr"
        label={translate('resources.product.extra_attr')}>
        <SimpleFormIterator {...props}>
          <FormDataConsumer>
            {({ getSource, scopedFormData }) => [
              <div className={'mb-20'} />,

              <TextInput
                fullWidth
                source={getSource('title')}
                label={translate('resources.product.title')}
                record={scopedFormData}
              />,
              <TextInput
                fullWidth
                source={getSource('des')}
                label={translate('resources.product.description')}
                record={scopedFormData}
              />,
            ]}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="labels" label={translate('resources.product.labels')}>
        <SimpleFormIterator {...props}>
          <FormDataConsumer>
            {({ getSource, scopedFormData }) => (
              <TextInput
                fullWidth
                source={getSource('title')}
                label={translate('resources.product.title')}
                record={scopedFormData}
              />
            )}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>

      <SelectInput
        label={translate('resources.product.status')}
        source="status"
        defaultValue={'published'}
        choices={[
          { id: 'published', name: translate('resources.product.published') },
          { id: 'processing', name: translate('resources.product.processing') },
          { id: 'draft', name: translate('resources.product.draft') },
          { id: 'deleted', name: translate('resources.product.deleted') },
        ]}
      />
      <SelectInput
        label={translate('resources.page.access')}
        defaultValue={'public'}
        source="access"
        choices={[
          { id: 'public', name: translate('resources.page.public') },
          { id: 'private', name: translate('resources.page.private') },
        ]}
      />
    </SimpleForm>
  );
};

export default Form;
