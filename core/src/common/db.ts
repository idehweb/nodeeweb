import mongoose from "mongoose";
import store from "../../store";
import { log } from "../../utils/log";

export async function dbConnect() {
  const db = await mongoose.connect(store.env.MONGO_URL, {
    dbName: store.env.DB_NAME,
  });
  store.db = db;
  log("DB connected");
}
export async function dbDisconnect() {
  if (!store.db) return;
  await store.db.disconnect();
}
export async function dbInit() {}
