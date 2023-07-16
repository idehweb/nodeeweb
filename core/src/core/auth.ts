import store from '../../store';
import AuthGatewayStrategy from '../auth/authGateway.strategy';
import UserPassStrategy, {
  USER_PASS_STRATEGY,
} from '../auth/userPass.strategy';
import { registerAuthStrategy } from '../handlers/auth.handler';
import {
  controllerRegister,
  controllersBatchRegister,
} from '../handlers/controller.handler';

export function activeAuthControllers() {
  // register auth
  registerAuthStrategy(new UserPassStrategy(), 'CoreAuth');

  //   gateway
  const gateway = new AuthGatewayStrategy();

  //   register controllers
  controllersBatchRegister(
    [
      {
        method: 'post',
        service: [gateway.detect.bind(gateway), gateway.login.bind(gateway)],
        url: '/auth/:strategyId',
      },
      {
        method: 'post',
        service: [gateway.detect.bind(gateway), gateway.login.bind(gateway)],
        url: '/auth/:strategyId/detect',
      },
      {
        method: 'post',
        service: gateway.login.bind(gateway),
        url: '/auth/:strategyId/login',
      },
      {
        method: 'post',
        service: gateway.signup.bind(gateway),
        url: '/auth/:strategyId/signup',
      },
    ],
    {
      base_url: '/api/v1',
      from: 'CoreAuth',
    }
  );
}
