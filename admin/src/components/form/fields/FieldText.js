import React, {memo, useState} from 'react';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
import {MainUrl, uploadMedia} from "@/functions/index";
import { useTranslate } from 'react-admin';

function FieldText({field}) {
  const t=useTranslate();

  // const {t} = useTranslation();

  const {type, kind, size, className, name, label, options, placeholder, value} = field;
// return JSON.stringify(value)
  let [theVal, setTheVal] = useState(value)
  // console.log('field object', field)
  const formatPrice = value =>
    value === undefined
      ? '' // make controlled
      : numeral(value).format('$0,0.00')
  // return value;
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{label ? t(label) : t(name)}</label>
    <Field
      name={name}
      component="input"
      type="text"
      placeholder={placeholder ? placeholder : (label ? t(label) : t(name))}
      onChange={(e) => {
        console.log(e.target.value, name)
        field.setValue(name, e.target.value)

      }}
      className="mb-2 form-control ltr"
    />


  </Col>
}

export default memo(FieldText);
