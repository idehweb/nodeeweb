import React, {useEffect, useState} from 'react';
import {Field} from 'react-final-form'
import {Col} from 'shards-react';
// import {MainUrl, uploadMedia} from "@/functions/index";
import {getEntitiesForAdmin, MainUrl, uploadMedia} from "@/functions/index";
import { useTranslate } from 'react-admin';
import API, { BASE_URL } from "@/functions/API";
function FieldSelect(props) {
  const t=useTranslate();
  let {field,typeInitila} = props;
  
  let {type, kind, size, className, entity, optionName, optionValue, onChange, searchbox = true, options = [], limit = 1000, name, label, placeholder, value} = field;
  let [theVal, setTheVal] = useState(value)
  let [list, setList] = useState(options || [])
  let [search, setSearch] = useState('')
  useEffect(() => {
    if (limit) {
      limit = parseInt(limit)
    }
    // ttps://parts.arvandguarantee.shop/admin/form/0/10?_order=ASC&_sort=id
    if(typeInitila === 'form'){
      API.get(BASE_URL + `/admin/form/0/${limit}?_order=ASC&_sort=id`).then((res)=>{
        setList(res.data)
      }).catch((err)=>{

      })
    }
    if (entity && list.length === 0)
      getEntitiesForAdmin(entity, 0, limit).then((d) => {
        setList(d)
      }).catch((e) => {
       

      })
  }, [])
  // return;
  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{label && label}</label>

    <Field
    style={{fontFamily:'IRANSans !importan'}}
      name={name}
      component="select"
      type="select"
      allowNull={true}
      className="mb-2 form-control"
      // value={theVal}
      // defaultValue={theVal}
      onChange={(e) => {
        // console.log('e',e.target.value,field)
        setTheVal(e.target.value);
        if (onChange) {
          let ty = list.filter((i, idx) => {
              console.log(i['value'], e.target.value)
              if (optionValue)
                return (i[optionValue] == e.target.value)
              if (!optionValue)
                return (i['value'] == e.target.value)

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
      <option/>
      {
        typeInitila === 'form' ? (
          list && list.map((ch, c) => {
            return <option key={c} value={ch._id} style={{fontFamily:'IRANSans !importan'}}>
              {ch.slug} | {ch.title.fa}
            </option>
          })
        ):(
          list && list.map((ch, c) => {
            return <option key={c} value={optionValue ? ch[optionValue] : ch.value}>
              {optionName ? ch[optionName] : t(ch.label)}
            </option>
          })
        )
      }
      

    </Field>

  </Col>
}

export default React.memo(FieldSelect);