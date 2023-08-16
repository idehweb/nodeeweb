import { CoreConfigDto } from '../dto/config';

export enum SmsSubType {
  Register = 'register',
  OTP = 'otp',
}

export type ConfigChangeOpt = {
  merge?: boolean;
  restart?: boolean;
  external_wait?: boolean;
  internal_wait?: boolean;
};

export type ConfigType<C extends CoreConfigDto = CoreConfigDto> = C & {
  change(newConf: any, opt: ConfigChangeOpt): Promise<void>;
  toString(): string;
  toJSON(): object;
  toObject(): object;
  getPublic(): object;
};
