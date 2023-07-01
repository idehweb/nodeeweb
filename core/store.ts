import mongoose from "mongoose";
import { ENV, USE_ENV } from "./types/global";

export class Store {
  env: {
    MONGO_URL: string;
    PORT?: string;
    DB_NAME: string;
    NODE_ENV: ENV;
    isLoc: boolean;
    isPro: boolean;
    isDev: boolean;
    STATIC_SERVER: string;
    USE_ENV: USE_ENV;
    ADMIN_EMAIL: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
  } & { [k: string]: string };
  db: typeof mongoose;

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
