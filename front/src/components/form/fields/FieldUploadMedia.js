import React, {memo, useState} from 'react';
import {Field} from 'react-final-form'
import {Button, Col} from 'shards-react';
import {MainUrl, uploadMedia} from "#c/functions/index";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {getField} from "#c/components/form/fields";
import {useTranslation} from 'react-i18next';


function FieldUploadMedia(props) {
  let {field,formID} = props;
  const {t} = useTranslation();
  const {type, kind, size, className, name, label, options, placeholder, value} = field;
  let [theVal, setTheVal] = useState(value)

  return <Col
    sm={size ? size.sm : ''}
    lg={size ? size.lg : ''}
    className={'MGD ' + className}>
    <label htmlFor={name}>{label ? t(label) : t(name)}</label>
    <input
      name={name}
      accept="image/png, image/jpeg"
      // component="input"
      type="file"
      placeholder={placeholder ? placeholder : (label ? t(label) : t(name))}
      onChange={(props) => {
        let { target } = props;
        uploadMedia(target.files[0],() => void 0,formID,'media', (e) => {
          console.log("e", e);
        }).then(x => {
          if (x.success && x.media && x.media.url) {
            console.log("set", name, x.media.url);
            field.setValue(name, x.media.url);
          }
        });
      }}
      className="mb-2 form-control ltr"
    />
  </Col>

}
export default memo(FieldUploadMedia)
