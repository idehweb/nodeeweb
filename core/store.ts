import mongoose from 'mongoose';
import { ENV, MiddleWare, USE_ENV } from './types/global';
import { Application } from 'express';
import { ErrorPackageFn } from './types/error';
import { Server } from 'http';
import { AdminViewSchema } from './types/view';
import { AuthStrategy } from './types/auth';
import { PluginOut } from './types/plugin';
import { Pipe } from './types/pipe';
export class Store {
  env: {
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
    SMS_USERNAME?: string;
    SMS_PASSWORD?: string;
    BASE_URL: string;
    BASE_API_URL: string;
  } & { [k: string]: string };
  db: typeof mongoose;
  dirs: string[];
  app: Application;
  globalMiddleware: {
    error: ErrorPackageFn;
    pipes: { [key: string]: Pipe<unknown> };
  };
  server: Server;
  systemLogger: any;
  adminViews: { [key: AdminViewSchema['name']]: AdminViewSchema['content'] } =
    {};
  strategies = new Map<string, AuthStrategy>();
  plugins = new Map<PluginOut['type'], PluginOut['content']>();
  settings: {
    taxRate: number;
  } & {
    [key: string]: any;
  };

  constructor() {
    this.env = { ...process.env } as any;
    switch (this.env.NODE_ENV) {
      case ENV.DEV:
        this.env.isDev = true;
        break;
      case ENV.PRO:
        this.env.isPro = true;
        break;
      case ENV.LOC:
        this.env.isLoc = true;
        break;
    }

    this.settings = { taxRate: 0.25 };
    this.globalMiddleware = { pipes: {}, error: {} };
  }
}

const store = new Store();
export default store;
