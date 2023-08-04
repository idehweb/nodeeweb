import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field, Form} from 'react-final-form'
import {Button, Col, Container, Row} from 'shards-react';
import {useSelector} from "react-redux";
import {MainUrl, uploadMedia} from "#c/functions/index";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Stepper from "#c/components/page-builder/stepper";

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
  FieldTextarea,
  FieldUploadDocument,
  FieldUploadMedia

} from "#c/components/form/fields";
import DemoSteps from "#c/components/page-builder/stepper/demo";
import _ from 'lodash';
function CreateForm(props) {
  
  let {fields, rules = {fields: []},theFields=false, t,formFiledsDetail} = props;
  let {showSubmitButton,_id} = formFiledsDetail;
  const themeData = useSelector((st) => st.store.themeData);
  if (!themeData) {
    return
  }
  const [theRules, setTheRules] = useState({...{fields:rules.fields}});
  const [submitButton, setSubmitButton] = useState(showSubmitButton);

  const checkSteps = () =>{
    if(props.theFields.lenght > 0){
      props.theFields.map((fild,index)=>{
        if(fild.type === 'steps'){
          // setSubmitButton(false)
          // return;
          return false;
        }
      })
    }
  }
  useEffect(() => {
    // console.log('useEffect',rules)
    setSubmitButton(checkSteps);
    if (!theRules || (theRules && !theRules.fields) || (theRules.fields && !theRules.fields[0])) {
      Object.keys(fields).forEach((fi) => {
        let typ = typeof fields[fi];
        console.log('typ instanceofinstanceof' ,typ);
        if (fields[fi] instanceof Array) {
          typ = 'select';
        }
        rules.fields.push({
          "name": fi,
          "type": typ
        })
      })
      setTheRules(rules)
    }else{
      setTheRules(rules)

    }
  }, []);
  const required = value => (value ? undefined : 'فیلد الزامی می باشد');
  const TheField = (field) => {
    if (!field) {
      return <>no field</>
    }
    
    const {type,style, kind, size, className, options, disabled = false, name, label, placeholder,value,require} = field;
    if (type === "chatgpt") {
      return <ChatBase field={field}/>;
    }
    if (type === 'text') {
      
      // return <span
      //     name={fields.name}
      //     className="mb-2"
      //     style={dynamicStyle}>
      //     {fields.text}
      //       </span>
    }
    if ((type==='radiobuttonlists')) {
      
      return <Col
        sm={fields.sm ? fields.sm : ''}
        lg={fields.lg ? fields.lg : ''}
        className={'MGD ' +  (className !== undefined ? className : '')}>
        <label htmlFor={name}>{fields.label}</label>
        <div class="radio-toolbar">
            <input type="radio" id="radioApple" name="radioFruit" value="apple" checked />
            <label for="radioApple">Apple</label>
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
    if (type === "document") {
      return <FieldUploadDocument formID={formFiledsDetail._id} field={field}/>;
    }
    // if (type === "text") {
    //   return <FieldText field={field}/>;
    // }
    if (type === "media") {
      return <FieldUploadMedia formID={formFiledsDetail._id} field={field}/>;
    }
    if ((type==='button')) {
      return <Col
        sm={fields.sm ? fields.sm : ''}
        lg={fields.lg ? fields.lg : ''}
        className={'MGD ' +  (className !== undefined ? className : '')}>
        <label htmlFor={name}>{fields.label}</label>
        <Field
          name={fields.name}
          component="button"
          type="button"
          placeholder={fields.placeholder ? fields.placeholder : ''}
          className="mb-2 form-control"
          disabled={disabled}
          style={dynamicStyle}

        />
      </Col>
    }
    if (type === 'date') {
      // console.log('date')
      return <Col
        sm={size ? size.sm : ''}
        lg={size ? size.lg : ''}
        className={'MGD ' +  (className !== undefined ? className : '')}>
        <label htmlFor={name}>{label}</label>
        <Field
          name={name}
          component="input"
          type="date"
          placeholder={placeholder || label}
          className="mb-2 form-control"
          style={style}
        />

      </Col>
    }
    if (type === 'steps') {
      return <DemoSteps field={field} onSubmit={props.onSubmit} />
    }
    if ((type === 'string' || type==='input') || !type) {
      let w100,labelAlign;
      if(style.width === "100%"){
        w100 = '12';
      }
      if(style.textAlign){
        labelAlign = style.textAlign;
      }
      return <Col
        sm={w100 ? w100 : size.sm}
        lg={w100 ? w100 : size.lg}
        className={'MGD ' +  (className !== undefined ? className : '')} style={{textAlign:labelAlign}}>
        <label  htmlFor={name}>{label === name ? '' : label}</label>
        {/* <Field
          name={name}
          component="input"
          type="text"
          placeholder={placeholder || label}
          className="mb-2 form-control"
          disabled={disabled}
          style={style}
          /> */}
          <Field name={name} validate={require && required}>
            {({ input, meta }) => (
              <div>
                <input disabled={disabled}
                 style={style}
                  className={meta.error && meta.touched ? "mb-2 form-control  border-danger" : "mb-2 form-control "}
                   {...input}
                    type="text" placeholder={placeholder || label} />
                {meta.error && meta.touched && <span style={{display:'block',textAlign:'right',color:'red',fontWeight:'bold',marginRight:'20px'}}>{meta.error}</span>}
              </div>
            )}
          </Field>




      </Col>
    }
    if (type === 'text') {
      return <span
                name={name}
                className="mb-2"
                style={style}>
                {value}
            </span>
    }
    if (type === 'price') {
      // console.log('string')

      return <FieldPrice field={field}/>
    }
    if (type === 'json') {
      // console.log('string')

      return <FieldJson field={field}/>
    }
    if (type === 'object') {
      return <FieldObject field={field}/>
    }
    if (type === 'array') {
      return <FieldArray field={field}/>

    }
    if (type === 'checkbox') {
      // console.clear()
      // console.log(field)
      return <FieldCheckbox field={field}/>

    }
    if (type === 'checkboxes') {
      // console.clear()
      // console.log(field)
      return <FieldCheckboxes field={field}/>

    }
    if (type === 'radio') {
      // console.clear()
      // console.log(field)
      return <FieldRadio field={field}/>

    }
    if (type === 'select') {
      return <FieldSelect field={field}/>
    }
    if (type === 'server') {
      return <FieldServer field={field}/>

    }
    if (type === 'number') {
      return <FieldNumber field={field}/>

      // return <Col
      //   sm={size ? size.sm : ''}
      //   lg={size ? size.lg : ''}
      //   className={'MGD ' +  (className !== undefined ? className : '')}>
      //   <label htmlFor={name}>{t(label)}</label>
      //   <Field
      //     name={name}
      //     component="input"
      //     type="number"
      //     placeholder={placeholder || label}
      //     className="mb-2 form-control"
      //   />
      // </Col>
    }
    if (type === 'textarea') {
      return <Col
        sm={size ? size.sm : ''}
        lg={size ? size.lg : ''}
        className={'MGD ' + (className !== undefined ? className : '')}>
        <label htmlFor={name}>{label === name ? '' : label}</label>
        <FieldTextarea
          name={name}
          style={style}
          placeholder={placeholder || label}
          className="mb-2 form-control"
        />
      </Col>
    }
    if (type === 'boolean') {
      return <FieldBoolean field={field}/>
    }
    if (type === 'image') {
      // console.log('image')
      return <Col
        sm={size ? size.sm : ''}
        lg={size ? size.lg : ''}
        className={'MGD ' +  (className !== undefined ? className : '')}>
        <label htmlFor={name}>{t(label)}</label>
        <Field
          style={style}
          name={name} className="mb-2 form-control">
          {props => {
            console.log('props', props)
            return (
              <div className={'max-width100'}>
                <img style={{width:"100px"}} src={MainUrl + '/' + props.input.value}/>
                {!props.input.value && <input
                  name={props.input.name}
                  onChange={(props) => {
                    let {target} = props
                    console.log(props)
                    console.log(target.files[0])
                    uploadMedia(target.files[0], (e) => {
                      // console.log('e', e)
                    }).then(x => {
                      if (x.success && x.media && x.media.url) {
                        // console.log('set', name, x.media.url)

                        field.setValue(name, x.media.url)
                      }
                    })
                  }}

                  type={'file'}
                />}
                {props.input.value && <div className={'posrel'}><img src={MainUrl + '/' + props.input.value}/><Button onClick={(e)=>{
                  field.setValue(name, '')
                }} className={'removeImage'}><RemoveCircleOutlineIcon/></Button></div>}
              </div>
            )
          }}
        </Field>


      </Col>
    }
    if (type === 'images') {
      // console.log('image')
      return <Col
        sm={size ? size.sm : ''}
        lg={size ? size.lg : ''}
        className={'MGD ' +  (className !== undefined ? className : '')}>
        <label htmlFor={name}>{label}</label>
        <Field
          style={style}
          name={name} className="mb-2 form-control">
          {props => {
            return (
              <div className={'max-width100'}>
                {!props.input.value && <input
                  name={props.input.name}
                  onChange={(props) => {
                    let {target} = props
                    uploadMedia(target.files[0], (e) => {
                      console.log('e', e)
                    }).then(x => {
                      if (x.success && x.media && x.media.url) {

                        field.setValue(name, x.media.url)
                      }
                    })
                  }}

                  type={'file'}
                />}
                {props.input.value && <img src={MainUrl + '/' + props.input.value}/>}
              </div>
            )
          }}
        </Field>


      </Col>
    }

  }

  const onSubmit = async v => {
    let objForm = v;
    if(objForm.hasOwnProperty('undefined')){
      delete objForm['undefined'];
    }
    if (props.onSubmit) {
      let values = objForm;
      if (theRules && theRules.fields)
        theRules.fields.forEach((item, i) => {
          if (item.type == 'object' && values[item.name] instanceof Array && item.value) {
            let obj = {};
            item.value.forEach((its) => {
              if (its)
                obj[its.property] = its.value
            })
            values[item.name] = obj;
          }
        })

      props.onSubmit(values)
    }
  }
  if (themeData)
    return (
      <div className="fields pt-2">
        <Form
          onSubmit={onSubmit}
          initialValues={fields}
          mutators={{
            setValue: ([field, value], state, {changeValue}) => {
              changeValue(state, field, () => value)
            },
          }}
          render={({
                     handleSubmit, form, submitting, pristine, values
                   }) => (
            <form onSubmit={handleSubmit}>
              <Container>
                <Row>
                  {theFields && theFields.map((field, index) => {
                    if (fields[field.name]) {
                      field.value = fields[field.name]
                    }
                    let lastObj = {
                      id: index,
                      type: field.type,
                      label: field.name,
                      name: field.name,
                      size: {
                        sm: 6,
                        lg: 6,
                      },
                      onChange: (text) => {
                      },
                      className: 'rtl',
                      placeholder: '',
                      child: [],
                      ...field

                    };
                    if (field.value) {
                      lastObj['value'] = field.value;
                    }
                    return (<TheField onSubmit={onSubmit} key={index} {...lastObj} setValue={form.mutators.setValue}/>);
                  })}
                  {!theFields && theRules?.fields?.map((field, index) => {
                    if (fields[field.name]) {
                      field.value = fields[field.name]
                    }
                    let lastObj = {
                      id: index,
                      type: field.type,
                      label: field.name,
                      name: field.name,
                      size: {
                        sm: 6,
                        lg: 6,
                      },
                      onChange: (text) => {
                      },
                      className: 'rtl',
                      placeholder: '',
                      child: [],
                      ...field

                    };
                    if (field.value) {
                      lastObj['value'] = field.value;
                    }
                    return (<TheField onSubmit={onSubmit} key={index} {...lastObj} setValue={form.mutators.setValue}/>);
                  })}
                    {
                      showSubmitButton && (
                        <div className="buttons">
                          <Button type="submit">
                            {t('Submit')}
                          </Button>
                        </div>
                      )
                    }
                    {
                      formFiledsDetail.hasOwnProperty('showSubmitButton') === false &&(
                        <div className="buttons">
                          <Button type="submit">
                            {t('Submit')}
                          </Button>
                        </div>
                      )
                    }
                </Row>
              </Container>
            </form>)}
        />
      </div>
    );
  else return <></>
}

export default withTranslation()(CreateForm);
