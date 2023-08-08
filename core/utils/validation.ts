import { Transform, Type } from 'class-transformer';
import { isMongoId } from 'class-validator';
import { ValidationError } from '../types/error';
import { Types } from 'mongoose';

export function ToID(isOptional = false) {
  return Transform(({ value, key }) => {
    return Array.isArray(value) ? value.map(core) : core(value);
    function core(value: any) {
      if (isOptional && value === undefined) return value;
      if (!isMongoId(value))
        throw new ValidationError(`${key} must be mongo id`);
      return new Types.ObjectId(value);
    }
  });
}
