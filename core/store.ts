import mongoose from "mongoose";
import { ENV, USE_ENV } from "./types/global";
import { Application } from "express";
import { ErrorPackageFn } from "./types/error";
import { Server } from "http";
export class Store {
  env: {
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
  } & { [k: string]: string };
  db: typeof mongoose;
  dirs: string[];
  app: Application;
  errorPackage: ErrorPackageFn;
  server: Server;

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
  }
}

const store = new Store();
export default store;
