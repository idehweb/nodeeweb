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
  return getStaticDir("schema", true)[0];
}
export function getStaticDir(dirName: string, only_app_dir = true) {
  return (only_app_dir ? [store.dirs[0]] : store.dirs).map((dir) =>
    join(dir, dirName)
  );
}
