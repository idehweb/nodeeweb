import React, { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';

import { useTranslate } from 'react-admin';

// import { JsonEditor as Editor } from 'jsoneditor-react';

// import 'jsoneditor-react/es/editor.min.css';
function FieldJson(props) {
  // console.clear();
  const t = useTranslate();

  let { field } = props;
  const { type, kind, size, className, name, label, placeholder, value } =
    field;

  let [theVal, setTheVal] = useState(value);

  const changeVal = (e) => {
    console.log(e.target.value);
    setTheVal(e.target.value);
  };
  // return;
  console.log('theVal', theVal);
  return (
    <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>

      <Field
        name={name}
        onBlur={(e) => {
          console.log('blur');
          input.onBlur(e);
        }}
        className="mb-2 form-control">
        {(props) => {
          let { input } = props;
          // return <Editor name={name} className={'ltr'} onChange={(e) => {
          //   changeVal(e)
          // }} value={theVal} type={"text"}/>
        }}
      </Field>
    </Col>
  );
}

export default FieldJson;
