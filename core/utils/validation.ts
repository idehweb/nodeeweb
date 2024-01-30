import {
  ClassConstructor,
  Transform,
  TransformOptions,
  plainToInstance,
} from 'class-transformer';
import {
  isMongoId,
  registerDecorator,
  ValidationOptions,
  ValidationError,
  validate,
} from 'class-validator';
import { ValidationError as VE } from '../types/error';
import _, { property } from 'lodash';
import { Types } from 'mongoose';
import parse from 'node-html-parser';

export function ToMongoID(opt?: TransformOptions) {
  return Transform(({ value, key, options }) => {
    return Array.isArray(value) ? value.map(core) : core(value);
    function core(value: any) {
      if (!isMongoId(value)) return value;
      return new Types.ObjectId(value);
    }
  }, opt);
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
          return core(value);
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
  const parseErrors: { [key: string]: string[] } = {};
  const propertyChain = (err: any) => {
    const chain: string[] = [];
    while (err._parent) {
      if (err._parent.property) chain.push(err._parent.property);
      err = err._parent;
    }
    return chain.reverse().join('.');
  };
  while (errs && i <= depth) {
    errs = errs.flatMap((err) => {
      Object.entries(err?.constraints ?? {}).forEach(([k, v]) => {
        if (!k) return;
        if (!parseErrors[k]) parseErrors[k] = [];
        const chain = propertyChain(err);
        parseErrors[k].push(chain ? `${v} in ${chain}` : v);
      });
      const children = err?.children ?? [];
      children.forEach((child) => (child['_parent'] = err));
      return children;
    });
    i++;
  }

  parseErrors.toString = () => {
    return Object.entries(parseErrors)
      .filter(([k, v]) => k !== 'toString')
      .map(([k, v]) => v)
      .flat()
      .join(', ');
  };

  return parseErrors;
}

export async function validatePlain<C>(
  plain: any,
  dto: ClassConstructor<C>,
  strict = true
) {
  const instance: any = plainToInstance(dto, plain, {
    enableImplicitConversion: true,
    excludeExtraneousValues: !strict,
  });

  const errors = await validate(instance, {
    forbidUnknownValues: strict,
    forbidNonWhitelisted: strict,
    whitelist: strict,
  });

  if (errors.length) {
    const err = detectVE(errors);
    throw new VE(err.toString(), undefined, undefined, err);
  }

  return instance as C;
}

export type SlugOpt = {
  allow_underscore?: boolean;
  allow_uppercase?: boolean;
  allow_parenthesis?: boolean;
};

const default_slug_options: SlugOpt = {
  allow_underscore: true,
  allow_uppercase: true,
  allow_parenthesis: false,
};

export function isSlug(str: string, options: SlugOpt = {}) {
  if (typeof str !== 'string') return false;
  return true;

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

  // let regex_charset = new RegExp(`^[${charset}]+$`);
  let regex_charset = /^[^\s]+$/;
  let regex_boundaries_consecutive = /[-_]{3,}/;
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

export function Custom(
  validation: (value: any) => boolean,
  validationOptions?: ValidationOptions & { name: string }
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: validationOptions.name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validationOptions?.each
            ? Array.isArray(value)
              ? value.every(validation)
              : false
            : validation(value);
        },
      },
    });
  };
}

export function IsHTMLString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsHTMLString',
      target: object.constructor,
      propertyName,
      options: {
        message() {
          return `${propertyName} must be valid ${
            validationOptions?.each ? 'array of ' : ''
          }html string format`;
        },
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          try {
            if (!value || parse(value)) return true;
          } catch (err) {}
          return false;
        },
      },
    });
  };
}
