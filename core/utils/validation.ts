import { Transform } from 'class-transformer';
import {
  isMongoId,
  registerDecorator,
  ValidationOptions,
  ValidationError,
} from 'class-validator';
import { Types } from 'mongoose';

export function ToMongoID() {
  return Transform(({ value, key, options }) => {
    return Array.isArray(value) ? value.map(core) : core(value);
    function core(value: any) {
      if (!isMongoId(value)) return value;
      return new Types.ObjectId(value);
    }
  });
}

export function IsMongoID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMongoID',
      target: object.constructor,
      propertyName,
      options: {
        message() {
          return `${propertyName} must be valid ${
            validationOptions?.each ? 'array of ' : ''
          }mongo id`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return validationOptions?.each
            ? Array.isArray(value)
              ? value.every(core)
              : false
            : core(value);
          function core(value: any) {
            return value instanceof Types.ObjectId || isMongoId(value);
          }
        },
      },
    });
  };
}

export function detectVE(errors: ValidationError[], depth = 10) {
  let errs = errors,
    i = 1;
  const filteredErrors = {};
  while (errs && i <= depth) {
    errs = errs.flatMap((err) => {
      Object.entries(err?.constraints ?? {}).forEach(
        ([k, v]) =>
          (filteredErrors[k] = `${
            filteredErrors[k] ? `${filteredErrors[k]} , ` : ''
          }${v}`)
      );
      return err?.children ?? [];
    });
    i++;
  }
  return filteredErrors;
}
