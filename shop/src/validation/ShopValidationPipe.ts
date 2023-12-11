import { MiddleWare } from '@nodeeweb/core';
import { ValidateArgs, ValidatePipe } from '@nodeeweb/core/types/pipe';
import { detectVE, validatePlain } from '@nodeeweb/core/utils/validation';
import { ClassConstructor } from 'class-transformer';
import { ValidationError } from 'class-validator';

export default class ShopValidationPipe implements ValidatePipe {
  private types: Function[] = [String, Boolean, Number, Array, Object];
  private _detectError(errors: ValidationError[], depth = 10) {
    return detectVE(errors, depth);
  }
  async transform<C>(value: any, metatype: ClassConstructor<C>) {
    if (!metatype || !this.toValidate(metatype)) return value as C;

    const object = await validatePlain(value, metatype, false);
    return object as C;
  }
  private toValidate(metatype: ClassConstructor<unknown>): boolean {
    return !this.types.includes(metatype);
  }

  pipeCreator: (args: ValidateArgs | ValidateArgs[]) => MiddleWare = (args) => {
    const argsArr: ValidateArgs[] = Array.isArray(args) ? args : [args];
    return async (req, _, next) => {
      for (const { dto, reqPath } of argsArr) {
        const value = req[reqPath];
        req[reqPath] = await this.transform(value, dto);
      }

      return next();
    };
  };
}
