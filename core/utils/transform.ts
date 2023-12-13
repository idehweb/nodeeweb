import { Transform, TransformOptions } from 'class-transformer';
import _ from 'lodash';

export function ToArray(opt?: TransformOptions) {
  return Transform(({ obj, key }) => {
    const value = obj[key];
    // null or undefine
    if (_.isNil(value)) return value;

    // not object
    if (typeof value !== 'object') return [];

    // empty object
    if (_.isEmpty(value)) return [];

    // not array
    if (!Array.isArray(value)) return [value];

    // array
    return value;
  }, opt);
}

export function ToObject(opt?: TransformOptions) {
  return Transform(({ obj, key }) => {
    const value = obj[key];

    // null or undefine
    if (_.isNil(value)) return value;

    // not object
    if (typeof value !== 'object') return {};

    // object
    return value;
  }, opt);
}
