import { ValidationError } from '@nodeeweb/core';
import { toMs } from '@nodeeweb/core/utils/helpers';
import { Expose, Transform } from 'class-transformer';
import { Allow, IsOptional } from 'class-validator';

export class ReportBaseQueryParam<F = any> {
  @Expose()
  @IsOptional()
  @Transform(({ obj, key }) => {
    try {
      const value = obj[key];
      switch (typeof value) {
        case 'number':
          return value;
        case 'string':
          return toMs(value);
      }
    } catch (err) {
      throw new ValidationError(
        'invalid period value, it must be number or valid human time such as: 1h'
      );
    }
  })
  period?: number;

  @Expose()
  @IsOptional()
  @Allow()
  @Transform(({ obj, key }) => obj[key])
  filter?: F;
}
