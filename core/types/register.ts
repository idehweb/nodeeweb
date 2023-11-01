import { Logger } from '../src/handlers/log.handler';

export type RegisterOptions = {
  from?: string;
  logger?: Logger;
  onStartup?: boolean;
};
