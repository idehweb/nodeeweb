import { SupervisorEvent } from '../../dto/in/supervisor.dto';
import { controllerRegister } from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import service from './service';

export function registerSupervisorController() {
  controllerRegister(
    {
      method: 'post',
      service: [service.auth, service.onEvent],
      url: '/event',
      validate: { reqPath: 'body', dto: SupervisorEvent },
    },
    { base_url: '/api/v1/supervisor', from: 'CoreSupervisor', logger }
  );
}
