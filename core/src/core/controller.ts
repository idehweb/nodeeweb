import { ControllerSchema } from '../../types/controller';
import {
  controllerRegister,
  controllersBatchRegister,
} from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import { getAuth, mockTheme } from '../temp/routers';
import { getViewHandler } from './view';
export function registerDefaultControllers() {
  const controllerStack: ControllerSchema[] = [];

  // theme
  controllerStack.push({
    method: 'get',
    url: '/theme',
    // service: getTheme.bind(null, 'admin'),
    service: (req, res) => res.json(mockTheme()),
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
