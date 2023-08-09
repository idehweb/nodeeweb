import { Transform } from 'class-transformer';
import {
  isMongoId,
  registerDecorator,
  ValidationOptions,
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
