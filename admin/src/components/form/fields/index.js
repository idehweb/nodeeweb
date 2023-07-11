import FieldObject from './FieldObject';
import FieldArray from './FieldArray';
import FieldBoolean from './FieldBoolean';
import FieldSelect from './FieldSelect';
import FieldPrice from './FieldPrice';
import FieldCheckbox from './FieldCheckbox';
import FieldCheckboxes from './FieldCheckboxes';
import FieldServer from './FieldServer';
import FieldText from './FieldText';
import FieldTextarea from './FieldTextarea';
import FieldJson from './FieldJson';
import FieldNumber from './FieldNumber';
import EveryFields from './EveryFields';
import ConditionFiled from './ConditionFiled';
import FieldUploadMedia from './FieldUploadMedia';
import FieldUploadDocument from './FieldUploadDocument';
import ConditionRow from './ConditionRow';
import ChatBase from './ChatBase';


export {
  FieldObject,
  EveryFields,
  FieldNumber,
  FieldTextarea,
  FieldJson,
  FieldText,
  FieldArray,
  FieldBoolean,
  FieldSelect,
  FieldPrice,
  FieldCheckbox,
  FieldCheckboxes,
  FieldServer,
  ConditionFiled,
  FieldUploadDocument,
  FieldUploadMedia,
  ChatBase,
  ConditionRow
};

import { useTranslate } from 'react-admin';

export const getField = type => {
  switch (type) {
    case 'object':
      return FieldObject;
    case 'string':
      return FieldText;
    case 'color':
      return FieldText;
    case 'price':
      return FieldPrice;
    case 'number':
      return FieldNumber;
    case 'select':
      return FieldSelect;
    case 'checkbox':
      return FieldCheckbox;
    case 'boolean':
      return FieldBoolean;
    default:
      return FieldText;
  }
};
