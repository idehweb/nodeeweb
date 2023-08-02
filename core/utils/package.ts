import fs from 'fs';
import { join } from 'path';
import info from '../package.json';

export const APP_INFO = getRealRoot('package.json');
export const NODE_MODULE_PATH = getRealRoot('node_modules');
export const CORE_NODE_MODULE_PATH: string | null = fs.existsSync(
  join(NODE_MODULE_PATH, info.name)
)
  ? join(NODE_MODULE_PATH, info.name)
  : null;
function getRealRoot(filePath: string) {
  for (const path of require.main.paths) {
    const infoPath = join(path, '..', filePath);
    if (fs.existsSync(infoPath)) return infoPath;
  }
  return null;
}

export const CORE_NODE_MODULE_PATH_RELATIVE = `./${join(
  './node_modules',
  info.name
)}`;
