import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsMultiLang(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMultiLang',
      target: object.constructor,
      propertyName,
      options: {
        message() {
          return `${propertyName} must be multi-lang form`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return Object.entries(value).every(([, v]) => typeof v === 'string');
        },
      },
    });
  };
}
