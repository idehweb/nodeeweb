import mongoose from 'mongoose';
import { Server } from 'http';
import { ENV, Seo, SupervisorEmitter } from './types/global';
import { Application } from 'express';
import { ErrorPackageFn } from './types/error';
import { AdminViewSchema } from './types/view';
import { AuthStrategy } from './types/auth';
import { Pipe } from './types/pipe';
import { ConfigType } from './types/config';
import { RestartPolicy } from './types/restart';
import { StoreEnv } from './types/store';
import EventEmitter from 'events';
import { PluginCore } from './src/plugin/plugin';
import { StoreTemplate } from './types/template';
import { StoreRoute } from './types/route';
import { SystemNotif } from './types/systemNotif';
import { CoreEventEmitter } from './src/event/CoreEventEmitter.abstract';
export class Store {
  env: StoreEnv;
  db: typeof mongoose;
  dirs: string[];
  app: Application;
  seo: Seo;
  supervisor?: SupervisorEmitter;
  globalMiddleware: {
    error: ErrorPackageFn;
    pipes: { [key: string]: Pipe<unknown> };
  };
  server: Server;
  systemLogger: any;
  adminViews: { [key: AdminViewSchema['name']]: AdminViewSchema['content'] } =
    {};
  templates: { [key: string]: StoreTemplate } = {};
  routes: { [k: string]: StoreRoute } = {};
  strategies = new Map<string, AuthStrategy>();
  plugins = new PluginCore();
  config: ConfigType;
  event: CoreEventEmitter;
  fixedHandlers: any[] = [];
  sysNotifs: SystemNotif[] = [];

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

    this.env.MAX_NUM_OF_PROXY =
      this.env.MAX_NUM_OF_PROXY === undefined ? 0 : +this.env.MAX_NUM_OF_PROXY;

    this.globalMiddleware = { pipes: {}, error: {} };

    if (this.env.ADMIN_VERSION === 'null') delete this.env.ADMIN_VERSION;
    if (this.env.FRONT_VERSION === 'null') delete this.env.FRONT_VERSION;

    if (
      ['null', 'false', undefined, null].includes(
        this.env.FORCE_STATIC_MATCH as string
      )
    )
      this.env.FORCE_STATIC_MATCH = false;
    else this.env.FORCE_STATIC_MATCH = true;
  }
}

const store = new Store();
export default store;
