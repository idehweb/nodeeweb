/* eslint-disable @typescript-eslint/ban-types */
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationError as VE } from '../../types/error';
import { MiddleWare } from '../../types/global';
import store from '../../store';
import { ValidateArgs, ValidatePipe } from '../../types/pipe';

export class CoreValidationPipe implements ValidatePipe {
  private types: Function[] = [String, Boolean, Number, Array, Object];
  private _detectError(errors: ValidationError[], depth = 10) {
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
  private async transform(value: any, metatype: ClassConstructor<unknown>) {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = (plainToInstance(metatype, value, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    }) ?? {}) as object;
    const errors = await validate(object, {
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new VE(
        Object.entries(this._detectError(errors)).reduce((prev, [k, v]) => {
          return `${prev}\n${k} : ${v}`;
        }, '')
      );
    }
    return object;
  }
  private toValidate(metatype: ClassConstructor<unknown>): boolean {
    return !this.types.includes(metatype);
  }

  pipeCreator: (args: ValidateArgs | ValidateArgs[]) => MiddleWare[] = (
    args
  ) => {
    const argsArr: ValidateArgs[] = Array.isArray(args) ? args : [args];
    return [
      async (req, _, next) => {
        for (const { dto, reqPath } of argsArr) {
          const value = req[reqPath];
          req[reqPath] = await this.transform(value, dto);
        }

        return next();
      },
    ];
  };
}

export function validateCreator(args: ValidateArgs | ValidateArgs[]) {
  if (!store.globalMiddleware.pipes.validation)
    throw new Error('you must register validation pipe first');
  return store.globalMiddleware.pipes.validation.pipeCreator(args)[0];
}
