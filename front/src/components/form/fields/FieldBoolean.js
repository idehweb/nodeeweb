import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
import {MainUrl, uploadMedia} from "#c/functions/index";
import Switch from '@mui/material/Switch';
function FieldBoolean(props) {
  // console.clear();
  let {field,t} = props;
  const {type, kind, size, className, name, label, placeholder, value = false} = field;
  // console.log('***field',value)

  // let [theVal, setTheVal] = useState(value)
  // console.log('field object', field)

  // return;
  // console.log('theVal', theVal)
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{label ? t(label) : t(name)}</label>

    <Field
      name={name}
      // onChange={(e)=>{
      //   console.log('e',e)
      //   setTheVal(!theVal)
      // }}
      initialValue={value}
      // value={value}
      className="mb-2 form-control" type="checkbox">
      {props => {
        let {input} = props;
        let {value,checked} = input;
// console.clear()
//         console.log(checked)
        return  <Switch
          // defaultChecked
          checked={checked}
          name={props.input.name}
          onChange={props.input.onChange}

        />
      }}
    </Field>


  </Col>

}

export default withTranslation()(FieldBoolean);
