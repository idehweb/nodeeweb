import {
  ClassConstructor,
  Transform,
  plainToInstance,
} from 'class-transformer';
import {
  isMongoId,
  registerDecorator,
  ValidationOptions,
  ValidationError,
  validate,
} from 'class-validator';
import _ from 'lodash';
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

  filteredErrors.toString = () => {
    return Object.entries(filteredErrors)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  };

  return filteredErrors;
}

export async function validatePlain<C>(
  plain: any,
  dto: ClassConstructor<C>,
  strict = true
) {
  const instance: any = plainToInstance(dto, plain, {
    enableImplicitConversion: true,
  });

  const errors = await validate(instance, {
    forbidUnknownValues: strict,
    forbidNonWhitelisted: strict,
    whitelist: strict,
  });

  if (errors.length) {
    throw new Error(detectVE(errors).toString());
  }

  return instance as C;
}

export type SlugOpt = {
  allow_underscore?: boolean;
  allow_uppercase?: boolean;
  allow_parenthesis?: boolean;
};

const default_slug_options: SlugOpt = {
  allow_underscore: false,
  allow_uppercase: false,
  allow_parenthesis: false,
};

export function isSlug(str: string, options: SlugOpt = {}) {
  if (typeof str !== 'string') return false;

  options = _.merge(options, default_slug_options);

  let charset = 'a-z0-9\\-';

  if (options.allow_underscore) {
    charset += '_';
  }

  if (options.allow_uppercase) {
    charset += 'A-Z';
  }
  if (options.allow_parenthesis) {
    charset += '\\(\\);';
  }

  let regex_charset = new RegExp(`^[${charset}]+$`);
  let regex_boundaries_consecutive = /[-_]{2,}/;
  let regex_boundaries_leading = /^[-_]/;
  let regex_boundaries_trailing = /[-_]$/;

  return (
    regex_charset.test(str) &&
    !regex_boundaries_consecutive.test(str) &&
    !regex_boundaries_leading.test(str) &&
    !regex_boundaries_trailing.test(str)
  );
}

export function IsSlug(opt?: SlugOpt, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSlug',
      target: object.constructor,
      propertyName,
      options: {
        message() {
          return `${propertyName} must be valid ${
            validationOptions?.each ? 'array of ' : ''
          }slug format`;
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
            return isSlug(value, opt);
          }
        },
      },
    });
  };
}
