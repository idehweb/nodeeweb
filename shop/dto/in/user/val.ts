import {
  ValidationOptions,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { Types } from 'mongoose';

export function IsProfileId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsProfileId',
      target: object.constructor,
      propertyName,
      options: {
        message() {
          return `${propertyName} must be valid ${
            validationOptions?.each ? 'array of ' : ''
          }mongo id or equal to me`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return core(value);
          function core(value: any) {
            return (
              value instanceof Types.ObjectId ||
              isMongoId(value) ||
              value === 'me'
            );
          }
        },
      },
    });
  };
}
