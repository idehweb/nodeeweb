import { CoreConfigBody } from '../../dto/config';
import { RestartBody } from '../../dto/in/restart.dto';
import { ControllerSchema } from '../../types/controller';
import { configService } from '../config/service';
import { AdminAccess, OptUserAccess } from '../handlers/auth.handler';
import {
  controllerRegister,
  controllersBatchRegister,
} from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import { getAuth, mockTheme } from '../temp/routers';
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

  // config
  controllerStack.push(
    {
      method: 'get',
      url: '/config/system',
      service: configService.get,
      access: AdminAccess,
    },
    {
      method: 'put',
      url: '/config/system',
      service: configService.update,
      access: AdminAccess,
      validate: { reqPath: 'body', dto: CoreConfigBody },
    },
    {
      method: 'get',
      url: '/config/admin-dash',
      service: configService.getAdminDashConf,
      access: AdminAccess,
    },
    {
      method: 'get',
      url: '/config/view',
      service: configService.getViewConf,
    }
  );

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
