import { ControllerSchema } from '../../types/controller';
import { OptUserAccess } from '../handlers/auth.handler';
import {
  controllerRegister,
  controllersBatchRegister,
} from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import { getAuth, mockTheme } from '../temp/routers';
import settingService from './setting';
import { getViewHandler } from './view';
export function registerDefaultControllers() {
  const controllerStack: ControllerSchema[] = [];

  // theme
  controllerStack.push({
    method: 'get',
    url: '/theme',
    access: OptUserAccess,
    service: settingService.getTheme,
  });

  // auth
  controllerStack.push({
    method: 'post',
    url: '/admin/admin/login',
    service: getAuth,
  });

  //   register
  controllersBatchRegister(controllerStack, {
    logger,
    base_url: '/api/v1',
    from: 'CoreController',
  });

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
