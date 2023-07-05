import fs from "fs";
import path from "path";
import store from "../../store";
import { USE_ENV } from "../../types/global";
import { PACKAGE_PREFIX } from "../../utils/path";
import _ from "lodash";

export default function setCustomEnv() {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath);

  // use env
  const node_modules_ns = resolveApp(PACKAGE_PREFIX);
  if (fs.existsSync(node_modules_ns)) store.env.USE_ENV = USE_ENV.NPM;
  else store.env.USE_ENV = USE_ENV.GIT;

  // dirs
  const env_dirs = (store.env.APP_DIRS ?? "").split(",").map((d) => d.trim());
  store.dirs = _.uniq(
    [
      appDirectory,
      ...env_dirs,
      store.env.USE_ENV === USE_ENV.NPM ? PACKAGE_PREFIX : "",
    ].filter((d) => d)
  );

  // log file
  store.env.logIntoFile =
    (store.env.LOG_TO_FILE && store.env.LOG_TO_FILE) !== "false" ||
    !store.env.isLoc;
}

setCustomEnv();
