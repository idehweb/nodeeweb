import { Transform, TransformOptions } from 'class-transformer';
import _ from 'lodash';
import { safeJsonParse } from './helpers';

export function ToArray(opt?: TransformOptions) {
  return Transform(({ obj, key }) => {
    const value = obj[key];
    // null or undefine
    if (_.isNil(value)) return value;

    const parsedValue = safeJsonParse(value);

    // not object
    if (typeof parsedValue !== 'object') return [];

    // empty object
    if (_.isEmpty(parsedValue)) return [];

    // not array
    if (!Array.isArray(parsedValue)) return [parsedValue];

    // array
    return parsedValue;
  }, opt);
}

export function ToObject(opt?: TransformOptions) {
  return Transform(({ obj, key }) => {
    const value = obj[key];

    // null or undefine
    if (_.isNil(value)) return value;

    // json
    if (typeof value === 'string') return safeJsonParse(value);

    // not object
    if (typeof value !== 'object') return {};

    // object
    return value;
  }, opt);
}

export function ToSlug(opt?: TransformOptions) {
  return Transform(({ obj, key }) => {
    const value = obj[key];

    // null or undefine
    if (_.isNil(value)) return value;

    // not string
    if (typeof value !== 'string') return value;

    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }, opt);
}

export function ToUnset({
  signs = [''],
  ...opt
}: TransformOptions & { signs?: any[] } = {}) {
  return Transform(({ obj, key, value }) => {
    // not in
    if (signs.findIndex((val) => _.isEqual(val, obj[key])) === -1) return value;

    // in
    _.set(obj, `$unset.${key}`, '');
    return;
  }, opt);
}

export function ToAny(opt?: TransformOptions) {
  return Transform(({ obj, key }) => obj[key], opt);
}

export function ExcludeFullish({
  fullish = [false, undefined, null, ''],
  ...opts
}: TransformOptions & { fullish?: any[] } = {}) {
  return Transform(
    ({ obj, key, value }) => (fullish.includes(obj[key]) ? undefined : value),
    opts
  );
}
