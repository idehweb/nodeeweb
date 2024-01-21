import * as fs from 'fs';

import { isExist } from '../../utils/helpers';
import { getLocalMarketPluginPath, getPluginPath } from '../../utils/path';
import { registerPluginControllers } from './controller';
import localService from './local.service';
import logger from '../handlers/log.handler';
import { color } from '../../utils/color';

export async function initPlugins() {
  // create plugins path
  const pluginsPath = getPluginPath('.');
  if (!(await isExist(pluginsPath))) {
    await fs.promises.mkdir(pluginsPath);
    logger.log(
      color('White', `[CorePlugin] create plugins dir: ${pluginsPath}`)
    );
  }

  // create local market plugin path
  const localMarketPath = getLocalMarketPluginPath();
  if (!(await isExist(localMarketPath)))
    await fs.promises.mkdir(localMarketPath);

  // register
  await localService.initPlugins();

  // controllers
  registerPluginControllers();
}
