import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';

import Switch from '@mui/material/Switch';
import { useTranslate } from 'react-admin';

import { EveryFields } from '@/components/form/fields';

function FieldBoolean(props) {
  const t = useTranslate();

  // console.clear();
  let { field, removeField } = props;
  const {
    type,
    kind,
    size,
    className,
    name,
    label,
    placeholder,
    value = false,
  } = field;
  // console.log('***field',value)

  // let [theVal, setTheVal] = useState(value)
  // console.log('field object', field)

  // return;
  // console.log('theVal', theVal)
  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>
      <EveryFields onClick={(e) => removeField(e)} />

      <Field
        name={name}
        // onChange={(e)=>{
        //   console.log('e',e)
        //   setTheVal(!theVal)
        // }}
        initialValue={value}
        // value={value}
        className="mb-2 form-control"
        type="checkbox">
        {(props) => {
          let { input } = props;
          let { value, checked } = input;
          // console.clear()
          //         console.log(checked)
          return (
            <Switch
              // defaultChecked
              checked={checked}
              name={props.input.name}
              onChange={props.input.onChange}
            />
          );
        }}
      </Field>
    </Col>
  );
}

export default FieldBoolean;
