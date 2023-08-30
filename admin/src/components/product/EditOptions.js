import React from 'react';
import {
  ArrayInput,
  FormDataConsumer,
  NumberInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
} from 'react-admin';
import { Button, ButtonGroup } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddRoadIcon from '@mui/icons-material/AddRoad';

import Select from 'react-select';
import { useWatch, useFormContext } from 'react-hook-form';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { numberWithCommas } from '@/functions';
import API from '@/functions/API';
import {
  CatRefField,
  FileChips,
  List,
  ShowDescription,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  SimpleImageField,
  UploaderField,
  Combinations,
  StockStatus,
} from '@/components';

const customStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
    color: state.isSelected ? '#212529' : '#fff',
    backgroundColor: state.isSelected ? '#a0a0a0' : '#212529',
  }),

  control: (defaultStyles) => ({
    ...defaultStyles,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    padding: '10px',
    border: 'none',
    boxShadow: 'none',
  }),
  singleValue: (defaultStyles) => ({ ...defaultStyles, color: '#fff' }),
};
// API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

const typeChoices2 = [
  {
    id: '',
    name: 'نامشخص',
  },
  {
    id: false,
    name: 'موجود نیست',
  },
  {
    id: true,
    name: 'موجود هست',
  },
];

export default (props) => {
  console.log('EditOptions...');
  // console.clear()/;
  const values = {};
  // let {values} = useFormState();
  let valuesoptions = useWatch({ name: 'options' });
  let valuestype = useWatch({ name: 'type' });
  let valuesformData = useWatch({ name: 'formData' });
  let valuescombinations = useWatch({ name: 'combinations' });
  const { setValue } = useFormContext();
  let translate = useTranslate();
  let lan = translate('lan');
  // console.log('valuescombinations',valuescombinations)
  // console.log("edit options props", valuesoptions);
  // const {input} = useInput(props);
  // const [display, setDisplay] = React.useState(true);
  const [options, setOptions] = React.useState(
    valuesoptions || [{ _id: 0, name: '', values: [] }]
  );
  // const [combinations, setCombinations] = React.useState(valuescombinations || []);
  // const [type, setType] = React.useState(valuestype);
  const [change, setChanger] = React.useState(true);
  // const [TheformData, setTheformData] = React.useState(valuesformData);
  // const [selectS, setSelectS] = React.useState([true, true]);
  const [name, setName] = React.useState('');
  const [changes, setChanges] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [child, setChild] = React.useState([]);
  const [attributes, setAttributes] = React.useState({});
  const [attributesList, setAttributesList] = React.useState([]);

  // console.log('propsvalues', props, values);
  // const [g, setG] = React.useState([]);
  // const [d, setD] = React.useState([]);
  // const [progress, setProgress] = React.useState(0);
  const handleVariables = (e) => {
    e.preventDefault();
    let cds = [];

    let y = props.onCreateCombinations(options);
    valuescombinations = y;
    valuesoptions = options;
    console.log('valuesoptions', valuesoptions);
    console.log('valuescombinations', valuescombinations);
    setValue('options', valuesoptions);
    setValue('combinations', valuescombinations);

    // setCombinations(valuescombinations);
    // console.log('form',form.watch('combinations'));
    // form.setValue('combinations',valuescombinations);
    // console.log('form',form.watch('combinations'));
    props.updater(options);
    setOptions(options);
    setChanges(!changes);
    setCounter(counter + 1);
  };
  const handleAdd = (e) => {
    e.preventDefault();
    // let t=options;
    // console.log('options', options);
    // options.push({name:'',values:''});
    // setDisplay(false);
    setOptions((options) => [...options, { name: '', values: [] }]);
    // setDisplay(true);
  };
  const handleRemove = (e, op) => {
    e.preventDefault();
    let tl = [];
    options.map((option, key) => {
      // console.log('op , key', op, key)
      if (op !== key) {
        tl.push(option);
      }
    });
    // options.push({name:'',values:''});
    // setDisplay(false);
    // console.log('options', tl);

    setOptions(tl);
    // setDisplay(true);
  };
  const chooseValue = (op, ff) => {
    let cds = [];
    console.log('chooseValue', op, ff);
    if (op)
      op.forEach((uf, s) => {
        cds.push({
          name: uf.label,
          id: s,
        });
      });
    // setOptions();/
    options[ff].values = cds;
    // console.log('options', options);

    // console.log('chooseValue res', cds);
    setOptions(options);
  };
  const chooseOptionName = (ff, op) => {
    // return;
    console.log('== >  chooseOptionName', op, options, ff, attributes);
    options[op]._id = ff.value;
    options[op].name = ff.label;
    options[op].values = ff.values;
    options[op].isDisabled = true;
    // console.log("options", options);
    setOptions(options);
    setChanger(!change);
    // API.get('/attributes/' + op.value, {}, {})
    //     .then(({data = []}) => {
    //         console.log('data', data);
    //         var cds = [];
    //         data.values.forEach((uf, s) => {
    //             cds.push({
    //                 value: uf.name.fa,
    //                 label: uf.name.fa,
    //                 key: s
    //             })
    //
    //         });
    //         child[op.key] = data.values;
    //         console.log('child', child);
    //         setChild(child);
    //         // setSelectS([false, true, true]);
    //         // changeSecondInput(defaultV);
    //     });
  };
  const getData = () => {
    API.get('/attributes/0/1000', {}).then(({ data: { data = [] } }) => {
      var cds = [];
      data.forEach((uf, s) => {
        cds[uf.name[lan]] = {
          values: uf.values,
          value: uf.name[lan],
          label: uf.name[lan],
          key: s,
        };
        attributesList.push({
          values: uf.values,
          value: uf.name[lan],
          label: uf.name[lan],
          key: s,
        });
      });
      // console.clear();
      // console.log('data.values', cds);
      setAttributes(cds);
      // setSelectS([false, false]);
      // setName(name.fa);
      // setSelectS([false, true, true]);
      // changeSecondInput(defaultV);
    });
  };
  React.useEffect(() => {
    console.log('React.useEffect');
    getData();
    // if (input.value) setV(input.value);
  }, []);
  // React.useEffect(() => {
  //     console.log('options',options);
  //     setOptions(options => [...options, {name: '', values: ''}]);

  // setOptions(oldArray => [...oldArray, newElement]);
  // setDisplay(true);
  // getData();
  // if (input.value) setV(input.value);
  // }, [options]);

  // console.log('childattributes', options, attributes, child, type, TheformData, props.type);
  // console.log("\n\n= = > now rendering () ...");
  // {

  // if (attributes) {
  // console.log("#attributes ", attributes);

  if (valuestype === 'variable') {
    console.log('valuestype ==>', valuestype);
    return [
      <div key="0" className={'width1000'}>
        {options.map((option, op) => {
          let tchild = [],
            tchildname;
          let DefaultValues = [];
          // console.log("#op:", op, " option", option, option.name);
          if (attributes[option.name] && attributes[option.name].values) {
            // console.log('attributes[op].values', attributes[op].values);

            if (attributes[option.name].label == option.name)
              attributes[option.name].values.map((at) => {
                tchildname = attributes[option.name].value;
                tchild.push({
                  value: at.name[lan],
                  label: at.name[lan],
                });
              });
          }
          if (options[op] && options[op].values) {
            options[op].values.map((at) => {
              DefaultValues.push({
                value: at.name,
                label: at.name,
              });
            });
          }
          // console.log("#tchildname ", tchildname);
          // console.log('#tchild ',   tchild,);
          console.log('#combinations ');

          return [
            <div key={op} className={'row mb-20 width1000'}>
              <div style={{ direction: 'rtl' }}># {op}</div>
              <div className={'col-md-5'}>
                <Select
                  isRtl={true}
                  styles={customStyles}
                  // isLoading={selectS[op]}
                  // isDisabled={selectS[op]}
                  className={'zindexhigh'}
                  onChange={(e) => chooseOptionName(e, op)}
                  defaultValue={{
                    value: option['name'],
                    label: option['name'],
                  }}
                  options={attributesList}
                />
              </div>
              {tchild && (
                <div className={'col-md-5'}>
                  <Select
                    isRtl={true}
                    styles={customStyles}
                    isMulti
                    // isLoading={selectS[op]}
                    // isDisabled={selectS[op]}
                    className={'zindexhigh'}
                    onChange={(e) => chooseValue(e, op)}
                    defaultValue={DefaultValues}
                    options={tchild}
                  />
                </div>
              )}
              <div className={'col-md-2'}>
                <Button
                  onClick={(e) => {
                    handleRemove(e, op);
                  }}>
                  <RemoveCircleOutlineIcon />
                </Button>
              </div>
            </div>,
          ];
        })}
      </div>,
      <ButtonGroup
        key="1"
        variant="contained"
        aria-label="outlined primary button group">
        <Button
          onClick={(e) => {
            handleAdd(e);
          }}>
          <AddCircleIcon />
          {translate('resources.product.addAttr')}
        </Button>
        <Button
          onClick={(e) => {
            handleVariables(e);
          }}>
          <AddRoadIcon />
          {translate('resources.product.createComb')}
        </Button>
      </ButtonGroup>,
      <div className={'mb-20'} key="2" />,
    ];
  } else {
    return <></>;
  }
};
