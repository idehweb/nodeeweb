import React ,{useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
import {MainUrl, uploadMedia} from "#c/functions/index";

function FieldNumber(props) {
  // console.clear();
  let {field,t} = props;
  const {type,style, kind, size, className, name, label,options, placeholder,value} = field;

  let [theVal,setTheVal]=useState(value)

  // return;
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    {/*<label htmlFor={name}>{label ? t(label) : t(name)}</label>*/}
    <label htmlFor={name}>{label === name ? '' : t(label)}</label>
    <Field
      name={name}
      component="input"
      type="number"
      style={style}
      placeholder={placeholder ? placeholder : (label ? t(label) : t(name))}

      className="mb-2 form-control ltr"
    />



  </Col>
}

export default withTranslation()(FieldNumber);
