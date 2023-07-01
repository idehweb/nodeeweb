import { join, resolve } from "path";
import fs from "fs";
import os from "os";
import info from "../package.json";
import store from "../store";
import { USE_ENV } from "../types/global";

export const PACKAGE_PREFIX = `./node_modules/${info.name}`;

export function getSharedPath(...path: string[]) {
  return join(store.env.SHARED_PATH || ".", ...path);
}

export function getScriptFile(
  scriptName: "cp" | "mkdir" | "mv" | "restart" | "download"
) {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath: string) =>
    resolve(appDirectory, relativePath);
  const scripts = resolveApp(
    store.env.USE_ENV === USE_ENV.NPM
      ? `${PACKAGE_PREFIX}/scripts`
      : "./scripts"
  );
  return join(
    scripts,
    `${scriptName}.${os.platform() === "win32" ? "bat" : "sh"}`
  );
}

export function getSchemaDir() {
  const dir: string[] = [];
  // local
  dir.push(getStaticDir("schema"));

  // package
  if (store.env.USE_ENV === USE_ENV.NPM) {
    dir.push(getStaticDir("schema", true));
  }

  return dir;
}
export function getStaticDir(dirName: string, from_node_modules = false) {
  return join(resolve(), from_node_modules ? PACKAGE_PREFIX : ".", dirName);
}
