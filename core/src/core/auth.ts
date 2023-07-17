import AuthGatewayStrategy from '../auth/authGateway.strategy';
import { OtpStrategy } from '../auth/otp.strategy';
import UserPassStrategy from '../auth/userPass.strategy';
import { registerAuthStrategy } from '../handlers/auth.handler';
import { controllersBatchRegister } from '../handlers/controller.handler';

export function activeAuthControllers() {
  // register auth
  registerAuthStrategy(new UserPassStrategy(), 'CoreAuth');
  registerAuthStrategy(new OtpStrategy(), 'CoreAuth');

  //   gateway
  const gateway = new AuthGatewayStrategy();

  //   register controllers
  controllersBatchRegister(
    [
      {
        method: 'post',
        service: [gateway.detect.bind(gateway)],
        url: '/auth/:strategyId',
      },
      {
        method: 'post',
        service: [gateway.detect.bind(gateway)],
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
