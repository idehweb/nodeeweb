import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
import {getEntities, MainUrl, uploadMedia} from "#c/functions/index";

function FieldServer(props) {
  // console.clear();
  let {field,t} = props;
  const {type, kind, size, className, name, label, placeholder, value} = field;

  let [theVal, setTheVal] = useState(value)
  let [theList, setTheList] = useState([])
  // console.log('field object', field)
  useEffect(() => {
    getEntities('customer', 0, 100, theVal).then(e => {
      console.log('e', e);
      setTheList(e);
    })
  }, [theVal]);
  const changeVal = (e) => {
    console.log(e.target.value)
    setTheVal(e.target.value)
  }
  // return;
  console.log('theVal', theVal)
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{label ? t(label) : t(name)}</label>

    <Field
      name={name}
      onBlur={e => {
        console.log("blur");
        input.onBlur(e);
      }}
      className="mb-2 form-control">
      {props => {
        let {input} = props;
        return <input name={name} onChange={(e) => {
          changeVal(e)
        }} value={theVal} type={"text"}/>
      }}
    </Field>
    {(theList && theList.length > 0) && <div className={'list-to-choose'}>
      {theList.map((thel, key) => {
        return <div key={key}>{thel.phoneNumber}</div>
      })}
    </div>}
  </Col>

}

export default withTranslation()(FieldServer);
