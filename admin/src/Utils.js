import {
  required,
  number,
  minValue,
  maxValue,
  minLength,
  maxLength,
  email,
} from 'react-admin';

export const Val = {
  req: [required()],
  reqNum: [required(), number()],
  num: [number()],
  reqNumRange: [required(), number(), minValue(0), maxValue(100)],
  reqMail: [required(), email()],
  reqMax: (max) => [required(), number(), maxValue(max)],
  reqMinLen: (min) => [required(), number(), minLength(min)],
  reqMaxLen: (max) => [required(), number(), maxLength(max)],
};
