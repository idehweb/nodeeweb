import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';

import { useTranslate } from 'react-admin';

import { EveryFields } from '@/components/form/fields';

function FieldPrice(props) {
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
  // console.log('field object', field)
  const formatPrice = (value) =>
    value === undefined
      ? '' // make controlled
      : numeral(value).format('$0,0.00');
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
        type="text"
        placeholder={placeholder ? placeholder : label ? t(label) : t(name)}
        format={(v) => {
          if (!v) return;

          return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }}
        parse={(v) => {
          if (!v) return;

          return v.toString().replace(/,/g, '');
        }}
        // format={formatPrice}
        // formatOnBlur
        className="mb-2 form-control ltr"
      />
    </Col>
  );
}

export default FieldPrice;
