import { AuthStrategyBody } from '../../dto/in/auth/index.dto';
import { ControllerSchema } from '../../types/controller';
import AuthGatewayStrategy from '../auth/authGateway.strategy';
import { GoogleStrategy } from '../auth/google.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { NodeewebStrategy } from '../auth/nodeeweb.strategy';
import { OtpStrategy } from '../auth/otp.strategy';
import { OtpPassStrategy } from '../auth/otpPass.strategy';
import UserPassStrategy from '../auth/userPass.strategy';
import { registerAuthStrategy } from '../handlers/auth.handler';
import { controllersBatchRegister } from '../handlers/controller.handler';
import logger from '../handlers/log.handler';

export function activeAuthControllers() {
  // register auth
  registerAuthStrategy(new UserPassStrategy(), 'CoreAuth');
  registerAuthStrategy(new OtpStrategy(), 'CoreAuth');
  registerAuthStrategy(new JwtStrategy(), 'CoreAuth');
  registerAuthStrategy(new GoogleStrategy(), 'CoreAuth');
  registerAuthStrategy(new NodeewebStrategy(), 'CoreAuth');
  registerAuthStrategy(new OtpPassStrategy(), 'CoreAuth');

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
        service: [gateway.signup.bind(gateway)],
        url: '/auth/:strategyId/signup',
      },
      {
        method: 'post',
        service: [gateway.logout.bind(gateway)],
        url: '/auth/:strategyId/logout',
      },
    ].map((s) => ({
      ...(s as ControllerSchema),
      validate: { dto: AuthStrategyBody, reqPath: 'body' },
    })),
    {
      base_url: '/api/v1',
      from: 'CoreAuth',
      logger,
    }
  );
}
