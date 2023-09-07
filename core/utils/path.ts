import { join, resolve } from 'path';
import fs from 'fs';
import os from 'os';
import store from '../store';
import { USE_ENV } from '../types/global';
import info, { CORE_NODE_MODULE_PATH, NODE_MODULE_PATH } from './package';

export function getPluginTemp(...path: string[]) {
  return getPluginPath('temp', ...path);
}

export function getPluginMarketPath(...path: string[]) {
  return join(getStaticDir('plugin-market', false).pop(), ...path);
}

export function getPluginPath(...path: string[]) {
  return join(getStaticDir('plugins', true)[0], ...path);
}

export function getSharedPath(...path: string[]) {
  return join(store.env.SHARED_PATH || './shared', ...path);
}

export function getScriptFile(
  scriptName: 'cp' | 'mkdir' | 'mv' | 'restart' | 'download'
) {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath: string) =>
    resolve(appDirectory, relativePath);
  const scripts = resolveApp(
    store.env.USE_ENV === USE_ENV.NPM
      ? join(CORE_NODE_MODULE_PATH, '..', 'scripts')
      : './scripts'
  );
  return join(
    scripts,
    `${scriptName}.${os.platform() === 'win32' ? 'bat' : 'sh'}`
  );
}

export function getSchemaDir() {
  return getStaticDir('schema', true)[0];
}
export function getStaticDir(dirName: string, only_app_dir = true) {
  return (only_app_dir ? [store.dirs[0]] : store.dirs).map((dir) =>
    join(dir, dirName)
  );
}
export function getPublicDir(dirName: string, only_app_dir = true) {
  return getStaticDir(join('public', dirName), only_app_dir);
}
export function getBuildDir(name: string) {
  const buildName = Object.keys(info.dependencies).find((k) =>
    k.endsWith(`${name}-build`)
  );
  if (!buildName)
    throw new Error(
      `not found any build package with name: ${name}-build in dependencies:\n${info.dependencies}`
    );
  return join(CORE_NODE_MODULE_PATH, buildName);
}
