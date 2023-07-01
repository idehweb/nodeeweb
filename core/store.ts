import mongoose from "mongoose";

export class Store {
  env: {
    MONGO_URL: string;
    PORT?: string;
    DB_NAME: string;
    [k: string]: string;
  };
  db: typeof mongoose;

  constructor() {
    this.env = process.env as any;
  }
}

const store = new Store();
export default store;
