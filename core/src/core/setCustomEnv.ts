import fs from 'fs';
import path, { join } from 'path';
import store from '../../store';
import { USE_ENV } from '../../types/global';
import { CORE_NODE_MODULE_PATH, NODE_MODULE_PATH } from '../../utils/package';
import _ from 'lodash';
import { BASE_API_URL } from '../constants/String';

export default function setCustomEnv() {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath);

  // use env
  if (CORE_NODE_MODULE_PATH !== NODE_MODULE_PATH)
    store.env.USE_ENV = USE_ENV.NPM;
  else store.env.USE_ENV = USE_ENV.GIT;

  // dirs
  const env_dirs = (store.env.APP_DIRS ?? '').split(',').map((d) => d.trim());
  store.dirs = _.uniq(
    [
      appDirectory,
      ...env_dirs,
      store.env.USE_ENV === USE_ENV.NPM
        ? join(CORE_NODE_MODULE_PATH, '..')
        : '',
    ].filter((d) => d)
  );

  // log file
  store.env.logIntoFile = store.env.LOG_TO_FILE
    ? store.env.LOG_TO_FILE !== 'false'
    : !store.env.isLoc;

  // base url
  if (!store.env.BASE_API_URL) store.env.BASE_API_URL = BASE_API_URL;
}

setCustomEnv();
