import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Button, Col} from 'shards-react';
import {MainUrl, uploadMedia} from "#c/functions/index";
import AddIcon from "@mui/icons-material/Add";
import {getField} from "#c/components/form/fields";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

let MainChild = [
  {
    "name": "thekey",
    "type": "string",
  },
  {
    "name": "values",
    "type": "string"
  },
]

function FieldObject(props) {
  // console.clear();
  let {field, t} = props;
  let {type, kind, size, className, name, label, placeholder, value = {}, setValue} = field;
  let result = Object.keys(value).map((key) => {
    // console.log(key,value[key])
    let obj = {};
    obj[key] = value[key];
    return obj
  });
  let [theArray, setArray] = useState(result || []);
  // let [theVal, setTheVal] = useState(value);
  //
  // const changeVal = (e) => {
  //   console.log(e.target.value)
  //   setTheVal(e.target.value)
  // }
  const addChild = () => {
    let temp = [...theArray, {"": ""}];

    setArray(temp);
  };
  const removeChild = (id) => {
    console.log('removeChild,', id);
    // if(id){
    //   parseInt(id);
    // }
    let temp = theArray.filter((i, idx) => {
      console.log('id', id, idx)
      return id != idx
    });
    console.log(temp);
    setArray(temp);
  };

// console.clear()
//   console.log('size',props)
//   let [theVal, setTheVal] = useState(value)
  // console.log('field object', field)
  if (kind == 'multiLang') {
    // return name;

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
          //   input.value = {};
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
          if (Object.keys(obj).length == 0) {
            obj = {"": ""}
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
                      console.log('theVal', theVal)
                      obj['fa'] = e.target.value;
                      let tt = theVal;
                      tt['fa'] = obj['fa'];
                      setTheVal(tt)
                      field.setValue(name, obj)
                    }}
                    type={'text'}
                    placeholder={'value'}
                    value={theVal ? theVal['fa'] : ''}

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
  let [theVal, setTheVal] = useState(value)

  const changeVal = (e) => {
    console.log(e.target.value)
    setTheVal((e.target.value))
  }
  // return name;
  // return <Col
  //   sm={size ? size.sm : ''}
  //   lg={size ? size.lg : ''}
  //   className={'MGD ' + className}>
  //   <label htmlFor={name}>{label ? t(label) : t(name)}</label>
  //
  //   <Field
  //     name={name}
  //     component="input"
  //
  //     format={(f)=>{
  //       console.log('format',f)
  //       return JSON.parse(f)
  //
  //     }}
  //     parse={(p)=>{
  //       console.log('parse',p)
  //       return JSON.stringify(p)
  //
  //
  //     }}
  //     onBlur={e => {
  //       console.log("blur");
  //       input.onBlur(e);
  //     }}
  //     className="mb-2 form-control ltr">
  //     {props => {
  //       let {input} = props;
  //       // return JSON.stringify(theVal)
  //       return <textarea name={name} className={'ltr mb-2 form-control'} onChange={(e) => {
  //         changeVal(e)
  //       }} value={(theVal)} type={"text"}/>
  //     }}
  //   </Field>
  //
  // </Col>
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{label ? t(label) : t(name)}</label>
    <Field
      parse={(v)=>{
        console.log('parse',v)
      }}
      format={(v)=>{
        console.log('format',v)
      }}
      name={name}
      className="mb-2 form-control">
      {() => {
        let child = MainChild
        let Component = getField("string");
        let arrr = Object.keys(theArray);
        // return JSON.stringify(arrr);

        // let arrr = theArray;
        return arrr.map((ke) => {

          // let theKey=theArray[ke];
          // let theVal=theArray[theKey];
          let fieldName = `${name}[${ke}].property`;
          let fieldNameValue = `${name}[${ke}].value`;
          let keys = Object.keys(theArray[ke]);
          if (keys && keys[0]) {
            keys = keys[0];
          }
          // return JSON.stringify(keys)
          // let fieldName=name;
          return (<div className={'row array-child-' + ke} key={ke}>

              <>
                {/*{JSON.stringify(theArray[ke][keys])}*/}
                <Component key={ke + 'x'} field={{
                  type:"string",
                  value: keys,
                  // label: keys,
                  name: fieldName,
                  setValue: setValue
                }}/>
                <Component key={ke + 'y'} field={{
                  type:"string",

                  // label: "#" + ke + " " + t("value"),
                  value: (theArray[ke][keys]),
                  // value: (theArray[ch] && ch2.name) ? theArray[ch][ch2.name] : {},
                  name: fieldNameValue,
                  setValue: setValue
                }}/></>

              {/*{child && child.map((ch2, idx2) => {*/}
              {/*let fieldName = `${name}[${ke}].${ch2.name}`;*/}
              {/*let Component = getField(ch2.type);*/}

              {/*return <Component key={idx2} field={{*/}
              {/*...ch2,*/}
              {/*value: (theArray[ch] && ch2.name) ? theArray[ch][ch2.name] : {},*/}
              {/*name: fieldName,*/}
              {/*setValue: setValue*/}
              {/*}}/>;*/}

              {/*})}*/}
              <span><Button onClick={(e) => {
                e.preventDefault();
                removeChild(ke);
              }}><RemoveCircleOutlineIcon/></Button></span>
            </div>
          )
        });
        // }

      }}
    </Field>


    <div className='col d-flex justify-content-sb'>
      <Button size="small" className='flLeft p-1' onClick={(e) => {
        e.preventDefault();
        addChild();
      }}>
        <AddIcon/>
      </Button>
    </div>
  </Col>

}

export default withTranslation()(FieldObject);
