import { RestartBody } from '../../dto/in/restart.dto';
import { ControllerSchema } from '../../types/controller';
import registerConfigControllers from '../config/controller';
import { AdminAccess, OptUserAccess } from '../handlers/auth.handler';
import {
  controllerRegister,
  controllersBatchRegister,
} from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import { registerSupervisorController } from '../supervisor/controller';
import restartService from './restart';
import settingService from './setting';
import { getViewHandler } from './view';
export function registerDefaultControllers() {
  const controllerStack: ControllerSchema[] = [];

  // restart
  controllerStack.push({
    method: 'put',
    service: restartService.restart,
    url: '/restart',
    access: AdminAccess,
    validate: { dto: RestartBody, reqPath: 'body' },
  });

  // theme
  controllerStack.push({
    method: 'get',
    url: '/theme',
    access: OptUserAccess,
    service: settingService.getTheme,
  });

  //   register
  controllersBatchRegister(controllerStack, {
    logger,
    base_url: '/api/v1',
    from: 'CoreController',
  });

  // config
  registerConfigControllers();

  // supervisor
  registerSupervisorController();

  // view
  const [viewPath, viewService] = getViewHandler();
  controllerRegister(
    {
      method: 'get',
      service: viewService,
      url: viewPath,
    },
    { base_url: '/', from: 'CoreController', logger }
  );
}
