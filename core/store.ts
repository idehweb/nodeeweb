import mongoose from 'mongoose';
import { Server } from 'http';
import { ENV } from './types/global';
import { Application } from 'express';
import { ErrorPackageFn } from './types/error';
import { AdminViewSchema } from './types/view';
import { AuthStrategy } from './types/auth';
import { PluginOut } from './types/plugin';
import { Pipe } from './types/pipe';
import { ConfigType } from './types/config';
import { RestartPolicy } from './types/restart';
import { StoreEnv } from './types/store';
import EventEmitter from 'events';
export class Store {
  env: StoreEnv;
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
  config: ConfigType;
  event: EventEmitter;

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
    if (!this.env.RESTART_POLICY)
      this.env.RESTART_POLICY = RestartPolicy.External;
    this.globalMiddleware = { pipes: {}, error: {} };
  }
}

const store = new Store();
export default store;
