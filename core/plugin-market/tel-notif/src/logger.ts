import { IConfig, Logger } from '../type';

export class NotifLogger implements Logger {
  constructor(private resolve: IConfig['resolve']) {}
  log = (...args: any[]) => {
    const logger = this.resolve('logger');
    logger.log(...args);
  };
  error = (...args: any[]) => {
    const logger = this.resolve('logger');
    logger.error(...args);
  };
}
