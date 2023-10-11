import { CoreConfigBody } from '../../dto/config';
import { ControllerSchema } from '../../types/controller';
import { AdminAccess } from '../handlers/auth.handler';
import { controllersBatchRegister } from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import { configService } from './service';

export default function registerConfigControllers() {
  const controllerStack: ControllerSchema[] = [];
  // config
  controllerStack.push(
    {
      method: 'get',
      url: '/system',
      service: configService.get,
      access: AdminAccess,
    },
    {
      method: 'put',
      url: '/system',
      service: configService.update,
      access: AdminAccess,
      validate: { reqPath: 'body', dto: CoreConfigBody },
    },
    {
      method: 'get',
      url: '/admin-dash',
      service: configService.getAdminDashConf,
      access: AdminAccess,
    },
    {
      method: 'get',
      url: '/website',
      service: configService.getWebConf,
    }
  );

  controllersBatchRegister(controllerStack, {
    base_url: '/api/v1/config',
    from: 'CoreConfig',
    logger,
  });
}
