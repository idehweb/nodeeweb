import mongoose from 'mongoose';
import { ENV, USE_ENV } from './types/global';
import { Application } from 'express';
import { ErrorPackageFn } from './types/error';
import { Server } from 'http';
import { AdminViewSchema } from './types/view';
import { AuthStrategy } from './types/auth';
import { PluginContent, PluginType } from './types/plugin';
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
  } & { [k: string]: string };
  db: typeof mongoose;
  dirs: string[];
  app: Application;
  errorPackage: ErrorPackageFn;
  server: Server;
  systemLogger: any;
  adminViews: AdminViewSchema[] = [];
  strategies = new Map<string, AuthStrategy>();
  plugins = new Map<PluginType, PluginContent>();
  settings: {
    taxRate: number;
  };

  constructor() {
    this.env = process.env as any;
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

    this.settings = { taxRate: 0 };
  }
}

const store = new Store();
export default store;
