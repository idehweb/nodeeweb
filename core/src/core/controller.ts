import { ControllerSchema } from '../../types/controller';
import { controllerRegister } from '../handlers/controller.handler';
import logger from '../handlers/log.handler';
import { getAuth, getTheme, mockTheme } from '../temp/routers';
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
  controllerStack.map((schema) =>
    controllerRegister(schema, {
      logger,
      base_url: '/api/v1',
      from: 'CoreController',
    })
  );
}
