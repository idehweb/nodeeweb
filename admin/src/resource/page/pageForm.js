import {
  DeleteButton,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useNotify,
  useRedirect,
  useTranslate,
} from 'react-admin';

import React from 'react';

import { RichTextInput } from 'ra-input-rich-text';

import API from '@/functions/API';
import { dateFormat } from '@/functions';
import {
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
  UploaderField,
} from '@/components';
import { Val } from '@/Utils';

// import { RichTextInput } from 'ra-input-rich-text';
// import {ImportButton} from "react-admin-import-csv";
let combs = [];
let _The_ID = null;

let valuess = { photos: [], files: [], thumbnail: '', combinations: [] };

function setPhotos(values) {
  // let {values} = useFormState();
  console.log('setPhotos', values);
  valuess['photos'] = values;
  // setV(!v);
  // this.forceUpdate();
}

function returnToHome(values) {
  // console.log('returnToHome', values);
  valuess['firstCategory'] = values['firstCategory'];
  valuess['secondCategory'] = values['secondCategory'];
  valuess['thirdCategory'] = values['thirdCategory'];
}

function onCreateCombinations(options) {
  // console.log('onCreateCombinations', options);
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
  // console.log('combinationsTemp', combinationsTemp);
  let ttt = cartesian(combinationsTemp);
  // console.log('ttt', ttt);

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
  // console.log('combinations', combinations);
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
  // console.log('returnCatsValues', values);
  return {
    firstCategory: valuess['firstCategory'],
    secondCategory: valuess['secondCategory'],
    thirdCategory: valuess['thirdCategory'],
  };
}

function thel(values) {
  return new Promise(
    (resolve) => {
      console.log('change photos field', values);

      valuess['photos'] = values;
      resolve(values);
    },
    (reject) => {
      reject(null);
    }
  );

  // console.log(values);
}

function theP(values) {
  console.log('change thumbnail field', values);
  valuess['thumbnail'] = values;
  // console.log(values);
}

function thelF(values) {
  // console.log('change files field', values);

  valuess['files'].push({
    url: values,
  });
  // console.log(values);
}

function CombUpdater(datas) {
  console.log('datas', datas);
  valuess['combinations'] = datas;
}

function OptsUpdater(datas) {
  console.log('datas', datas);
  valuess['options'] = datas;
}

const CustomToolbar = (props) => (
  <Toolbar {...props} className={'dfghjk'}>
    <SaveButton alwaysEnable />
    <DeleteButton mutationMode="pessimistic" />
  </Toolbar>
);

const Form = ({ children, ...props }) => {
  // console.log("vprops", props);
  const { record } = props;
  console.log('props', props);

  // if (!record) return null;

  const translate = useTranslate();
  const notify = useNotify();
  if (record && record._id) {
    console.log('_id set');
    _The_ID = record._id;
  }
  // const {reset} = useFormContext();
  const redirect = useRedirect();
  const transform = (data, { previousData }) => {
    console.log('transform={transform}', data, { previousData });

    return {
      ...data,
      // firstCategory: "61d58e37d931414fd78c7fb7"
    };
  };
  // console.log("record", record);
  // valuess['photos'] = props.record.photos || [];
  // if(valuess['options']!=record.options){
  //   record.options=valuess['options'];
  // }
  // console.log('productForm...',record);
  const totals = 0;

  function save(values) {
    console.log('_The_ID', _The_ID);

    if (valuess.firstCategory) {
      // console.log('let us set firstCategory');
      values.firstCategory = valuess.firstCategory;
    }
    if (valuess.secondCategory) {
      // console.log('let us set secondCategory');

      values.secondCategory = valuess.secondCategory;
    }
    if (valuess.thirdCategory) {
      // console.log('let us set thirdCategory');

      values.thirdCategory = valuess.thirdCategory;
    }
    if (valuess.thumbnail) {
      values.thumbnail = valuess.thumbnail;
    }
    if (valuess.photos) {
      values.photos = valuess.photos;
      // valuess['photos']
    }
    let initialElements = JSON.parse(localStorage.getItem('initialElements'));
    values.elements = initialElements;
    console.log('last values: ', values);
    // return;
    if (_The_ID) {
      // delete values.photos;
      delete values.category;
      delete values.catChoosed;
      delete values.elements;
      delete values.files;
      console.log('last values (edit): ', values);

      API.put('/page/' + _The_ID, JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          // const refresh = useRefresh();
          // refresh();
          // alert('it is ok');
          // showNotification(translate('page.updated'));
          // window.location.reload();
          notify('saved');
          redirect(false);
          if (data.success) {
            values = [];
            valuess = [];
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    } else {
      if (valuess.photos) {
        values.photos = valuess.photos;
      }
      if (valuess.files) {
        values.files = valuess.files;
      }
      API.post('/page/', JSON.stringify({ ...values }))
        .then(({ data = {} }) => {
          // showNotification(translate('page.created'));
          if (data._id) {
            _The_ID = data._id;
            window.location.href = '/#/page/' + _The_ID;
            // window.location.reload()
            // window.location.href = "/#/page/" + data._id;
            values = [];
            valuess = [];
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    }
  }

  return (
    <SimpleForm
      {...props}
      // toolbar={<CustomToolbar record={props.record}/>}
      // onSubmit={v => save(v)}
    >
      {children}
      {/*<TabbedDatagrid/>*/}
      <TextInput
        source={'title.' + translate('lan')}
        fullWidth
        label={translate('resources.page.title')}
        className={'width100 mb-20'}
        validate={Val.req}
      />
      <div className={'mb-20'}></div>
      <div className={'mb-20'}></div>
      <TextInput
        source="slug"
        fullWidth
        label={translate('resources.page.slug')}
        className={'width100 mb-20 ltr'}
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
        source="path"
        fullWidth
        label={translate('resources.page.path')}
        className={'width100 mb-20 ltr'}
      />
      <TextInput
        multiline
        fullWidth
        source={'excerpt.' + translate('lan')}
        label={translate('resources.page.excerpt')}
      />
      <RichTextInput
        multiline
        fullWidth
        source={'description.' + translate('lan')}
        label={translate('resources.page.description')}
      />
      <div className={'mb-20'}></div>
      {/*<UploaderField*/}
      {/*label={translate("resources.product.photo")}*/}
      {/*accept="image/*"*/}
      {/*source="photos"*/}
      {/*multiple={true}*/}
      {/*thep={theP}*/}
      {/*setPhotos={setPhotos}*/}
      {/*inReturn={thel}*/}
      {/*/>*/}
      {/*<SelectInput*/}
      {/*label={translate("resources.page.kind")}*/}
      {/*defaultValue={"post"}*/}
      {/*source="kind"*/}
      {/*choices={[*/}
      {/*{id: "post", name: translate("resources.page.post")},*/}
      {/*{id: "page", name: translate("resources.page.page")}*/}
      {/*]}*/}
      {/*/>*/}
      <TextInput
        source="kind"
        fullWidth
        label={translate('kind')}
        className={'width100 mb-20 ltr'}
      />
      <TextInput
        source="maxWidth"
        fullWidth
        label={translate('maxWidth')}
        className={'width100 mb-20 ltr'}
      />
      <TextInput
        source="classes"
        fullWidth
        label={translate('classes')}
        className={'width100 mb-20 ltr'}
      />
      <TextInput
        source="padding"
        fullWidth
        label={translate('padding')}
        className={'width100 mb-20 ltr'}
      />
      <TextInput
        source="margin"
        fullWidth
        label={translate('margin')}
        className={'width100 mb-20 ltr'}
      />
      <TextInput
        source="backgroundColor"
        fullWidth
        label={translate('backgroundColor')}
        className={'width100 mb-20 ltr'}
      />
      <SelectInput
        label={translate('resources.page.status')}
        defaultValue={'processing'}
        source="status"
        choices={[
          { id: 'published', name: translate('resources.page.published') },
          { id: 'processing', name: translate('resources.page.processing') },
          { id: 'deleted', name: translate('resources.page.deleted') },
        ]}
      />{' '}
      <SelectInput
        label={translate('resources.page.access')}
        defaultValue={'public'}
        source="access"
        choices={[
          { id: 'public', name: translate('resources.page.public') },
          { id: 'private', name: translate('resources.page.private') },
        ]}
      />
      {/*<ReferenceArrayInput label="انتخاب عنوان" source={getSource('title')}*/}
      {/*reference="attributes" filter={{f: true}}>*/}
      {/*<AutocompleteInput optionText="name.fa"*/}
      {/*optionValue="name.fa"/></ReferenceArrayInput>,*/}
      {/*<PageBuilder source="elements" record={record}/>*/}
    </SimpleForm>
  );
};

export default Form;
