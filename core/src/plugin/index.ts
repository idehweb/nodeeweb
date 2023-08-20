import { registerPluginControllers } from './controller';
import localService from './local.service';

export async function initPlugins() {
  // register
  await localService.initPlugins();

  // controllers
  registerPluginControllers();
}
