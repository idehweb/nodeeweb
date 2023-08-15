import { ENV, USE_ENV } from './global';
import { RestartPolicy } from './restart';

export type StoreEnv = {
  APP_NAME: string;
  MONGO_URL: string;
  PORT?: string;
  DB_NAME: string;
  NODE_ENV: ENV;
  isLoc: boolean;
  isPro: boolean;
  isDev: boolean;
  logIntoFile: boolean;
  STATIC_SERVER: string;
  USE_ENV: USE_ENV;
  ADMIN_EMAIL: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  APP_DIRS: string;
  AUTH_SECRET: string;
  LOG_TO_FILE: string;
  BASE_URL: string;
  BASE_API_URL: string;
  RESTART_WEBHOOK?: string;
  RESTART_WEBHOOK_AUTH_TOKEN?: string;
  RESTART_POLICY: RestartPolicy;
  RESTART_COUNT: string;
  RESTARTING: string;
} & { [k: string]: string };
