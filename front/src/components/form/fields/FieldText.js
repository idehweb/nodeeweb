import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';
import { MainUrl, uploadMedia } from '#c/functions/index';

// function FieldText({field}) {
function FieldText(props) {
  const { t } = useTranslation();

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
  } = props;
  // return JSON.stringify(value)
  let [theVal, setTheVal] = useState(value);
  // console.log('field object', field)
  const formatPrice = (value) =>
    value === undefined
      ? '' // make controlled
      : numeral(value).format('$0,0.00');
  // return value;
  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label === name ? '' : t(label)}</label>
      {/*<label htmlFor={name}>{label ? t(label) : t(name)}</label>*/}
      <Field
        name={name}
        component="input"
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          field.setValue(name, e.target.value);
        }}
        className="mb-2 form-control ltr"
      />
    </Col>
  );
}

export default memo(FieldText);
