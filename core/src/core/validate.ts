/* eslint-disable @typescript-eslint/ban-types */
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationError as VE } from '../../types/error';
import { MiddleWare } from '../../types/global';
import store from '../../store';
import { ValidateArgs, ValidatePipe } from '../../types/pipe';
import { detectVE } from '../../utils/validation';

export class CoreValidationPipe implements ValidatePipe {
  private types: Function[] = [String, Boolean, Number, Array, Object];
  private _detectError(errors: ValidationError[], depth = 10) {
    return detectVE(errors, depth);
  }
  async transform<C>(value: any, metatype: ClassConstructor<C>) {
    if (!metatype || !this.toValidate(metatype)) return value as C;

    const object = (plainToInstance(metatype, value, {
      enableImplicitConversion: true,
      // excludeExtraneousValues: true,
    }) ?? {}) as object;
    const errors = await validate(object, {
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    if (errors.length > 0) {
      throw new VE(this._detectError(errors).toString());
    }
    return object as C;
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
