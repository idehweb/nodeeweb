import { Transform, Type } from 'class-transformer';
import { isMongoId } from 'class-validator';
import { ValidationError } from '../types/error';
import { Types } from 'mongoose';

export function ToID() {
  return Transform(({ value, key, options }) => {
    return Array.isArray(value) ? value.map(core) : core(value);
    function core(value: any) {
      if (!isMongoId(value)) return value;
      return new Types.ObjectId(value);
    }
  });
}
