import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';

import { useTranslate } from 'react-admin';

import { MainUrl, uploadMedia } from '@/functions/index';
import { EveryFields } from '@/components/form/fields';

function FieldNumber(props) {
  // console.clear();
  const t = useTranslate();
  let { field, removeField } = props;
  const {
    type,
    kind,
    size,
    className,
    name,
    label,
    options,
    placeholder,
    value,
  } = field;

  let [theVal, setTheVal] = useState(value);

  // return;
  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>
      <EveryFields onClick={(e) => removeField(e)} />

      <Field
        name={name}
        component="input"
        type="number"
        placeholder={placeholder ? placeholder : label ? t(label) : t(name)}
        className="mb-2 form-control ltr"
      />
    </Col>
  );
}

export default FieldNumber;
