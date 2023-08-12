import { CoreConfigDto } from '../dto/config';

export type ConfigType<C extends CoreConfigDto = CoreConfigDto> = C & {
  change(
    newConf: any,
    opt: { merge?: boolean; restart?: boolean }
  ): Promise<void>;
};
