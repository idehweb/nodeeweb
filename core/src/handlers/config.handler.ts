import { CoreConfigDto } from '../../dto/config';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { color } from '../../utils/color';
import { getName, wait } from '../../utils/helpers';
import { Config } from '../config/config';

export function registerConfig<
  Dto extends CoreConfigDto,
  C extends Config<Dto>
>(config: C, { logger = store.systemLogger, from }: RegisterOptions) {
  store.config = config as any;
  logger.log(
    color(
      'Yellow',
      `## ${from ? `[${from}] ` : ''}Register Config => ${getName(
        config,
        false
      )} ##`
    )
  );
}
