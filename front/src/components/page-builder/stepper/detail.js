import React from 'react';
import {Field} from 'react-final-form'
import { Col, Container, Row} from 'shards-react';
import * as Icons from "@mui/icons-material";
import {
  FieldArray,
  FieldBoolean,
  FieldCheckbox,
  FieldCheckboxes,
  FieldJson,
  FieldNumber,
  FieldObject,
  FieldPrice,
  FieldSelect,
  FieldServer,
  FieldText,
  FieldRadio,
  FieldTextarea
} from "#c/components/form/fields";
import {setStyles} from "../../../functions"

 const StepDetail = (props) => {


  const {content,activeStep} = props;
  const childs = content[activeStep].children;
  let [dynamicActive,setDynamicActive] = React.useState('');
  const required = value => (value ? undefined : 'فیلد الزامی می باشد')
  const TheField = (valuesvalues) => {
    const {values} = valuesvalues;
    if (!values) {
      return <>no field</>
    }
    const {type,style, kind, size, className, options, disabled = false, name, label, placeholder,children} = values;
    const {settings} = values;
    const {general} = settings;
    const {fields} = general;
    let dynamicStyle = setStyles(fields)
    const Radio = ({ input, children }) =>
          {
            // input should contain checked value to indicate
            // if the input is checked
            console.log(input) || (
              <label>
                <input type="radio" {...input} />
                {children}
              </label>
          );
          }
    if ((name==='radiobuttonlists')) {
      return <Col
        sm={fields.sm ? fields.sm : ''}
        lg={fields.lg ? fields.lg : ''}
        className={'MGD ' +  (className !== undefined ? className : '')}>
        <label  htmlFor={name}>{fields.label}</label>
        <div className="radio-toolbar" >
        {/* <div className="radio-toolbar" style={dynamicStyle}> */}
          {children && children.map((child,ichi)=>
              <label style={setStyles(fields)} key={ichi}>
                  <Field
                   style={setStyles(child.settings.general.fields)}
                  //  onClick={next}
                    onClick={props.nextStep}
                   key={ichi}
                   name={fields.name}
                   type="radio" value={child.settings.general.fields.value}
                   component="input" />{Icons[child.settings.general.fields.iconFont] &&
                    <span>{React.createElement(Icons[child.settings.general.fields.iconFont])}</span>}{child.settings.general.fields.label}
              </label>
          )}
        </div>
{/*
        <Field
          name={fields.name}
          component="button"
          type="button"
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}

        /> */}
      </Col>
    }
    if (name === 'text') {
      return <span
          name={fields.name}
          className="mb-2"
          style={dynamicStyle}>
          {fields.text}
            </span>
    }
    if (name === 'steps') {
      return <DemoSteps field={values}/>
    }
    if ((name==='button')) {
      return <Col
        sm={fields.sm ? fields.sm : ''}
        lg={fields.lg ? fields.lg : ''}
        className={'MGD ' + (className !== undefined ? className : '')}>
        <Field
          name={fields.name}
          component="button"
          type="button"
          value={fields.text}
          onClick={(e)=>{setDynamicActive(fields.action ? fields.action : fields.text)}}
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}>
          {fields.text}
            </Field>
      </Col>
    }
    if ((name==='input')) {
      return <Col
        sm={fields.sm ? fields.sm : ''}
        lg={fields.lg ? fields.lg : ''}
        className={'MGD ' + (className !== undefined ? className : '')}>
        <label htmlFor={name}>{fields.label}</label>
        {/* <Field
          name={fields.name}
          component="input"
          type="text"
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}

        /> */}
        <Field name={fields.name} validate={require && required}>
            {({ input, meta }) => (
              <div>
                <input disabled={disabled}
                 style={dynamicStyle}
                  className={meta.error && meta.touched ? "mb-2 form-control  border-danger" : "mb-2 form-control "}
                   {...input}
                    type="text" placeholder={fields.placeholder ? fields.placeholder : ''} />
                {meta.error && meta.touched && <span style={{display:'block',textAlign:'right',color:'red',fontWeight:'bold',marginRight:'20px'}}>{meta.error}</span>}
              </div>
            )}
          </Field>
      </Col>
    }
    if (name === 'checkbox') {
      // console.clear()
      // console.log(field)
      return  <Col
      sm={fields.sm ? fields.sm : ''}
        lg={fields.lg ? fields.lg : ''}
      className={'MGD ' + (className !== undefined ? className : '')}>
      <Field name={name}
        // initialValue={()=> []}
      >
        {({input, meta}) => {
          return (
            <div><label htmlFor={name}>{fields.label}</label>
              <div className={"d-flex "}>
                {fields.options && fields.options.map((checkbox, i) => {
                  return <label key={i} className={'checkbox-items p-1'}>
                    <Field
                    name={fields.name}
                    component="input"
                    style={dynamicStyle}
                    type="checkbox"
                    value={checkbox.value}
                  />
                    <span>{checkbox.title}</span>
                  </label>
                })}


              </div>
            </div>
          )
        }}
      </Field>
    </Col>

    }

    if (name === 'radio') {
      return  <Col
      sm={fields.sm ? fields.sm : ''}
      lg={fields.lg ? fields.lg : ''}
      className={'MGD ' + (className !== undefined ? className : '')}>
      <Field name={name}
        // initialValue={()=> []}
      >
        {({input, meta}) => {
          return (
            <div><label htmlFor={name}>{fields.label}</label>
              <div className={"d-flex "}>
                {fields.options && fields.options.map((ch, i) => {
                  return <label key={i} className={'checkbox-items p-1'}>
                    <Field
                    name={fields.name}
                    component="input"
                    style={dynamicStyle}
                    type="radio"
                    value={ch.value}
                  />
                    <span>{ch.title}</span>
                  </label>
                })}


              </div>
            </div>
          )
        }}
      </Field>
    </Col>
    }
    if (name === 'select') {
      return <Col
      sm={fields.sm ? fields.sm : ''}
      lg={fields.lg ? fields.lg : ''}
      className={'MGD ' + (className !== undefined ? className : '')}>
      <label htmlFor={name}>{fields.label}</label>
      <Field
        name={fields.name}
        component="select"
        type="select"
        allowNull={true}
        className="mb-2 form-control"
        // value={selectValue}
        // onChange={(e) => {setSelectValue(e.target.value)}}
      >
        <option value="">{'انتخاب کنید'}</option>
        {fields.options && fields.options.map((ch, c) =>
            <option key={c} value={ch.value}>
              {ch.title}
            </option>
        )}
      </Field>
    </Col>

    }
     if (name === 'textarea') {
      return <Col
      sm={fields.sm ? fields.sm : ''}
      lg={fields.lg ? fields.lg : ''}
        className={'MGD ' + (className !== undefined ? className : '')}>
        <label htmlFor={name}>{fields.label}</label>
        {/* <Field
          name={fields.name}
          component="textarea"
          type="text"
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}
        /> */}
        <Field component="textarea" name={fields.name} validate={require && required}>
            {({ input, meta }) => (
              <div>
                <textarea
                 disabled={disabled}
                  style={dynamicStyle} 
                  className={meta.error && meta.touched ? "mb-2 form-control  border-danger" : "mb-2 form-control "}
                   {...input} 
                   placeholder={fields.placeholder ? fields.placeholder : ''} 
                   >
               
                  </textarea>
                {meta.error && meta.touched && <span style={{display:'block',textAlign:'right',color:'red',fontWeight:'bold',marginRight:'20px'}}>{meta.error}</span>}
              </div>
            )}
          </Field>
        {/* <FieldTextarea
          name={fields.name}
          style={dynamicStyle}
          placeholder={fields.placeholder  ?fields.placeholder : ''}
          className="mb-2 form-control"
        /> */}
      </Col>
    }
  }
React.useEffect(()=>{

},[])
  return (
    <Container>
    <Row>
      {childs && childs.map((field, index) => {
        return (<TheField key={index} values={field} />);
      })}
    </Row>
  </Container>
  );
};
export default React.memo(StepDetail)
