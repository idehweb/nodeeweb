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
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

import React, { useCallback, useEffect, useState } from 'react';

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

  return (
    <SimpleForm
      {...props}
      transform={transform}
      onSubmit={(v) => save(v)}
      toolbar={<CustomToolbar record={props.record} />}>
      {children}

      <TextInput
        source={'title.' + translate('lan')}
        label={translate('resources.product.title')}
        className={'width100 mb-20'}
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
      <TextInput
        multiline
        fullWidth
        source={'metadescription.' + translate('lan')}
        label={translate('resources.product.metadescription')}
      />

      <TextInput
        multiline
        fullWidth
        source={'excerpt.' + translate('lan')}
        label={translate('resources.product.excerpt')}
      />
      <RichTextInput
        fullWidth
        source={'description.' + translate('lan')}
        label={translate('resources.product.description')}
      />

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
                      if (!v) return '';

                      return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
