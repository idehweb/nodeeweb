import mongoose from "mongoose";
import fs from "fs";
import store from "../../store";
import { log } from "./log.handler";
import global from "../global";
import { getSchemaDir } from "../../utils/path";
import { join } from "path";

export async function dbRegisterModels() {
  // read dir
  const schemaDir = getSchemaDir();
  const schemaFiles = fs
    .readdirSync(schemaDir)
    .sort()
    .map((sp) => [sp.split(".")[0].split("-").pop(), join(schemaDir, sp)]);
  // import
  for (const [name, schemaFile] of schemaFiles) {
    const { default: schema } = await import(schemaFile);
    store.db.model(name, schema);
  }
}
