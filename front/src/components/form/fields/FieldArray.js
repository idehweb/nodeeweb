import React, {memo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Button, Col} from 'shards-react';
import {MainUrl, uploadMedia} from "#c/functions/index";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {getField} from "#c/components/form/fields";

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
)
function FieldArray({field}) {
console.log('FieldArray',field)
  const {t} = useTranslation();

  const {type, kind, size, className, name, label, placeholder, value = [], child, setValue} = field;
  // console.log('fieldfieldfieldfield', field);
  if (!Array.isArray(value))
    return null;

  let [theArray, setArray] = useState(value || []);
  const addChild = () => {
    let temp = [...theArray, child];

    setArray(temp);
  };
  const removeChild = (id) => {
    let temp = theArray.filter((i, idx) =>
      id !== idx
    );

    setArray(temp);
  };

  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD arrayField ' + className}>

    <div className='col d-flex justify-content-sb'>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>
      <Button size="small" className='flLeft p-1' onClick={(e) => {
        e.preventDefault();
        addChild();
      }}>
        <AddIcon/>
      </Button>
    </div>
    <Field
      name={name}
      className="mb-2 form-control">
      {() => {

        // return JSON.stringify(theArray);
        return theArray.map((ch, ke) =>
          (<div className={'row array-child-' + ke} key={ke}>
              {child && child.map((ch2, idx2) => {
                let fieldName = `${name}[${ke}].${ch2.name}`;
                let Component = getField(ch2.type);

                return <Component key={idx2} field={{
                  ...ch2,
                  value: (ch && ch2.name) ? ch[ch2.name] : {},
                  name: fieldName,
                  setValue: setValue
                }}/>;

              })}
              <span><Button onClick={(e) => {
                e.preventDefault();
                removeChild(ke);
              }}><RemoveCircleOutlineIcon/></Button></span>
            </div>
          ));


      }}
    </Field>
  </Col>

}

function ParseObjectToInput(props) {
  let {theKey, theVal, input} = props
  // if(!input){
  return
  // }
  let {value} = input
  return <div className={'max-width100'}>
    <div className={'width-less'}>
      <label htmlFor={theKey}>theKey</label>
      <input
        name={props.input.name}
        className={'ltr '}
        onChange={(e) => {
          console.log('props.target.value', e.target.value);
          let obj = {};
          // window.f = e.target.value;
          obj[e.target.value] = '';
          console.log('theKey', props.input)
          // field.theKey=props.target.value
          // field.setValue(name, obj)

        }}
        type={'text'}
        value={theKey}
        placeholder={'key'}
      />
    </div>
    <div className={'width-more'}>


      {(typeof input.value == 'string') && <><label htmlFor={name}>value</label><input
        name={props.input.name}
        onChange={(e) => {
          let obj = {};
          // obj[window.f] = e.target.value;
          // field.setValue(name, obj)
        }}
        type={'text'}
        placeholder={'value'}
        value={theVal[theKey]}

      /></>}
      {(typeof input.value == 'object') && Object.keys(theVal[theKey]).map((theKey2, inx) => {
        // return JSON.stringify(theKey2)
        return <>
          <div className={'width-more'}>
            <label>{theKey2}</label>
            <input
              name={props.input.name}
              className={'ltr '}
              onChange={(e) => {
                console.log('props.target.value', e.target.value);
                let obj = {};
                // window.f = e.target.value;
                obj[e.target.value] = '';
                console.log('theKey', props.input)
                // field.theKey=props.target.value
                // field.setValue(name, obj)

              }}
              type={'text'}
              value={JSON.stringify(theVal[theKey][theKey2])}
            />
          </div>
        </>
      })}


    </div>
  </div>
}


export default memo(FieldArray)
