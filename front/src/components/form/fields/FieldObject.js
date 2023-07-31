import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
import {MainUrl, uploadMedia} from "#c/functions/index";

function FieldObject(props) {
  // console.clear();
  let {field,t} = props;
  let {type, kind, size, className, name, label, placeholder, value={}} = field;
  // return JSON.stringify(field);

// console.clear()
//   console.log('size',props)
  let [theVal, setTheVal] = useState(value)
  // console.log('field object', field)
  // return name;
  if(kind=='multiLang'){
    return <Col
      sm={size ? size.sm : ''}
      lg={size ? size.lg : ''}
      className={'MGD ' + className}>
      <label htmlFor={name}>{label ? t(label) : t(name)}</label>

      <Field
        name={name} className="mb-2 form-control">
        {props => {
          let {input} = props;
          // let {value}=inputinput;
          let obj = {};
          // if (typeof input.value !== 'object') {
          //   input.value={};
          // }
          if (input.value) {
            obj = input.value;
          }
          // return  JSON.stringify(input.value);
          // console.log('Object.keys(obj) for ',props.input.name,':', input.value)
          // console.log('props', obj)

          // if (name === 'title') {
          //   // console.clear()
          //   console.log('field', field,obj,Object.keys(obj))
          //
          // }
          if(Object.keys(obj).length==0){
            obj={"":""}
          }
          // return  JSON.stringify(obj);

          // if (typeof input.value === 'object') {
          let y = Object.keys(obj).map((theKey, inx) => {
            // console.log('theKey',theKey)
            // return  JSON.stringify(theVal);

            return (
              <div className={'max-width100'}>
                <div className={'width-less'}>
                  <label htmlFor={theKey}>the key</label>
                  <input
                    name={props.input.name}
                    className={'ltr form-control'}
                    type={'text'}
                    value={theKey || 'fa'}
                    placeholder={'key'}
                  />
                </div>
                <div className={'width-more'}>

                  <label htmlFor={name}>value</label>
                  <input
                    className={'form-control'}
                    name={props.input.name}
                    onChange={(e) => {
                      let obj = {};
                      console.log('theVal',theVal)
                      obj['fa'] = e.target.value;
                      let tt=theVal;
                      tt['fa']=obj['fa'];
                      setTheVal(tt)
                      field.setValue(name, obj)
                    }}
                    type={'text'}
                    placeholder={'value'}
                    value={theVal['fa']}

                  />
                </div>
              </div>
            )
          });
          return y;
          // }
          if (typeof input.value == 'string') {

            return <div className={'width100%'}>

              <label htmlFor={name}>value</label>
              <textarea
                className={'the-textarea'}
                name={props.input.name}
                onChange={(e) => {
                  let obj = {};
                  // obj[window.f] = e.target.value;
                  field.setValue(name, obj)
                }}
                placeholder={'value'}
                defaultValue={props.input.value}

              />
            </div>
          }


        }}

      </Field>



    </Col>

  }
  // return;
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{t(label)}</label>
    <Field
      name={name} className="mb-2 form-control">
      {props => {
        let {input} = props;
        // let {value}=inputinput;
        let obj = {};
        if (input.value) {
          obj = input.value;
        }
        // console.log('Object.keys(obj) for ',props.input.name,':', input.value)
        console.log('props', obj)
        if (typeof input.value !== 'object') {
          return;
        }
        if (name === 'title') {
          // console.clear()
          console.log('field', field,obj,Object.keys(obj))

        }
        if(Object.keys(obj).length==0){
          obj={"":""}
        }
        if (typeof input.value === 'object') {
          let y = Object.keys(obj).map((theKey, inx) => {
            console.log('theKey',theKey)
            return (
              <div className={'max-width100'}>
                <div className={'width-less'}>
                  <label htmlFor={theKey}>theKey</label>
                  <input
                    name={props.input.name}
                    className={'ltr form-control'}
                    onChange={(e) => {
                      console.log('props.target.value', e.target.value);
                      let obj = {};
                      window.f = e.target.value;
                      obj[e.target.value] = '';
                      console.log('theKey', props.input)
                      // field.theKey=props.target.value
                      field.setValue(name, obj)

                    }}
                    type={'text'}
                    value={theKey}
                    placeholder={'key'}
                  />
                </div>
                <div className={'width-more'}>

                  <label htmlFor={name}>value</label>
                  <input
                    className={'form-control'}
                    name={props.input.name}
                    onChange={(e) => {
                      let obj = {};
                      obj[window.f] = e.target.value;
                      field.setValue(name, obj)
                    }}
                    type={'text'}
                    placeholder={'value'}
                    value={theVal[theKey]}

                  />
                </div>
              </div>
            )
          });
          return y;
        }
        if (typeof input.value == 'string') {

          return <div className={'width100%'}>

            <label htmlFor={name}>value</label>
            <textarea
              className={'the-textarea'}
              name={props.input.name}
              onChange={(e) => {
                let obj = {};
                // obj[window.f] = e.target.value;
                field.setValue(name, obj)
              }}
              placeholder={'value'}
              defaultValue={props.input.value}

            />
          </div>
        }


      }}
    </Field>


  </Col>

}

export default withTranslation()(FieldObject);
