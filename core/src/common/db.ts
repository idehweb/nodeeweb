import mongoose from "mongoose";
import fs from "fs";
import store from "../../store";
import { log } from "../../utils/log";
import { SingleJobProcess } from "./singleJob";
import global from "../global";
import { getSchemaDir } from "../../utils/path";
import { join } from "path";

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
export async function dbInit() {
  await SingleJobProcess.builderAsync("initial-db", async () => {
    // check admin
    const adminModel = store.db.model("Admin");
    const admin = await adminModel.findOne();
    if (!admin) {
      log("db is empty, let us import sample data...");
      await adminModel.create({
        email: store.env.ADMIN_EMAIL ?? "admin@example.com",
        username: store.env.ADMIN_USERNAME ?? "admin",
        nickname: store.env.ADMIN_USERNAME ?? "admin",
        password: store.env.ADMIN_PASSWORD ?? "admin",
        type: "user",
        token: global.generateUnid(),
      });
      log("admin created");
    }
  })();
}

export async function dbRegisterModels() {
  // read dir
  const schemaFiles = getSchemaDir().flatMap((p) =>
    fs
      .readdirSync(p)
      .map((sp) => [sp.split(".").slice(0, -1).join("."), join(p, sp)])
  );
  // import
  for (const [name, schemaFile] of schemaFiles) {
    const { default: schema } = await import(schemaFile);
    store.db.model(name, schema);
  }
}
