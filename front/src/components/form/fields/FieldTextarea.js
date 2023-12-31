import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Field } from 'react-final-form';
import { Col } from 'shards-react';
import { getEntities, MainUrl, uploadMedia } from '#c/functions/index';

function FieldTextarea(props) {
  const { className, name, style, value, placeholder } = props;

  // const {type, kind, size, className, name, label, placeholder, value} = field;

  let [theVal, setTheVal] = useState('');

  const changeVal = (e) => {
    setTheVal(e.target.value);
  };
  return (
    <textarea
      type="text"
      name={name}
      className={className}
      placeholder={placeholder}
      onChange={(e) => {
        changeVal(e);
      }}
      value={theVal}
      style={style}
    />
  );
}

export default withTranslation()(FieldTextarea);
