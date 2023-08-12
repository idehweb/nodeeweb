import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
// import {MainUrl, uploadMedia} from "#c/functions/index";
import {getEntitiesForAdmin, MainUrl, uploadMedia} from "#c/functions/index";

function FieldSelect(props) {
  const required = value => (value ? undefined : 'فیلد الزامی می باشد');
  let {field, t} = props;
  let {require,style,type, kind, size, className, entity, optionName, optionValue, onChange, searchbox = true, options = [], limit = 1000, name, label, placeholder, value} = field;
  let [theVal, setTheVal] = useState(value)
  let [theError, setError] = useState(false)
  let [list, setList] = useState(options || [])
  let [search, setSearch] = useState('')
  useEffect(() => {
    if (limit) {
      limit = parseInt(limit)
    }
    if (entity && list.length === 0)
      getEntitiesForAdmin(entity, 0, limit).then((d) => {
        setList(d)
      }).catch((e) => {

      })
      if(theVal){
        setError(false)
      }else{
        setError(true)
      }
  }, [])
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
    className={'MGD ' + className} style={{textAlign:labelAlign}}>
    <label htmlFor={name}>{label === name ? '' : t(label)}</label>

    {/* <Field
      validate={required}
      name={name}
      component="select"
      type="select"
      allowNull={true}
      className={theError  ? "mb-2 form-control  border-danger" : "mb-2 form-control "}
      onChange={(e) => {
        setTheVal(e.target.value);
      
        if (onChange) {
          let ty = list.filter((i, idx) => {
              console.log(i['value'], e.target.value)
              if (optionValue)
                return (i[optionValue] === e.target.value)
              if (!optionValue)
                return (i['value'] === e.target.value)

            }
          );
          // console.log('ty', ty)
          if (ty && ty[0] && ty[0].values)
            e.list = ty[0].values;
          field.setValue(name, e.target.value);

          onChange(e)
        }
        else
          field.setValue(name, e.target.value);
      }}
    >
       
      <option value="">{'انتخاب کنید'}</option>
      {list && list.map((ch, c) =>
          <option key={c} value={optionValue ? ch[optionValue] : ch.value}>
            {optionName ? ch[optionName] : t(ch.title)}
          </option>
      )}
            {({ input, meta }) => (
              <div>
                {meta.error && meta.touched && <span style={{display:'block',textAlign:'right',color:'red',fontWeight:'bold',marginRight:'20px'}}>{meta.error}</span>}
              </div>
            )}
    </Field> */}
    <Field name={name} validate={require  && required}>
            {({ input, meta }) => (
              <div>
                <select
                  {...input}
                  style={style}
                  className={meta.error && meta.touched ? "mb-2 form-control  border-danger" : "mb-2 form-control "}
                  onChange={(e) => {
                    setTheVal(e.target.value);
                  
                    if (onChange) {
                      let ty = list.filter((i, idx) => {
                          console.log(i['value'], e.target.value)
                          if (optionValue)
                            return (i[optionValue] === e.target.value)
                          if (!optionValue)
                            return (i['value'] === e.target.value)
            
                        }
                      );
                      // console.log('ty', ty)
                      if (ty && ty[0] && ty[0].values)
                        e.list = ty[0].values;
                      field.setValue(name, e.target.value);
            
                      onChange(e)
                    }
                    else
                      field.setValue(name, e.target.value);
                  }}
                >
                    <option value="">{'انتخاب کنید'}</option>
                    {list && list.map((ch, c) =>
                        <option key={c} value={optionValue ? ch[optionValue] : ch.value}>
                          {optionName ? ch[optionName] : t(ch.title)}
                        </option>
                    )}
                </select>
                {meta.error && meta.touched && <span style={{display:'block',textAlign:'right',color:'red',fontWeight:'bold',marginRight:'20px'}}>{meta.error}</span>}
              </div>
            )}
          </Field>

  </Col>
}

export default withTranslation()(FieldSelect);
