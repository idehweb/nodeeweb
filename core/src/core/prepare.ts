import * as fs from 'fs';
import path, { join } from 'path';
import {
  getBuildDir,
  getPublicDir,
  getScriptFile,
  getSharedPath,
  getStaticDir,
} from '../../utils/path';
import _ from 'lodash';
import { USE_ENV } from '../../types/global';
import store from '../../store';
import logger from '../handlers/log.handler';
import {
  getEnv,
  isExist,
  isExistsSync,
  safeRm,
  satisfyExistence,
  satisfyExistenceSync,
} from '../../utils/helpers';
import exec from '../../utils/exec';
import { color } from '../../utils/color';
import packageInfo, {
  APP_INFO,
  CORE_NODE_MODULE_PATH_RELATIVE,
  dispatchPackageInfo,
} from '../../utils/package';

export default async function prepare() {
  // install requirements
  await installRequirements();

  // create directories
  createSharedDir();
  createPublicDir();
  createStaticFilesDir();

  // copy public files
  await copyPublicFiles('admin', ['asset-manifest.json']);
  await copyPublicFiles('front', ['asset-manifest.json']);

  // copy static dirs
  await copyStaticFiles('schema');

  // link
  await linkIndex();
}

async function installRequirements() {
  await installStatics();
  await installDeps();
}

async function installDeps() {
  if (store.env.NOT_INSTALL_REQUIREMENTS || store.env.USE_ENV !== USE_ENV.NPM)
    return;

  const requirements = [
    'mongoose',
    'bcrypt',
    'reflect-metadata',
    'class-transformer',
    'class-validator',
    'axios',
    'lodash',
  ].filter((pack) => !packageInfo.dependencies[pack]);
  if (!requirements.length) return;
  logger.log(color('Green', `## Install ${requirements.join(', ')} ##`));
  await exec(
    `yarn add ${requirements
      .map((pn) => `link:./${join(CORE_NODE_MODULE_PATH_RELATIVE, pn)}`)
      .join(' ')}`,
    { logger }
  );

  // dispatch package info
  dispatchPackageInfo();
}
async function installStatics() {
  const adminVersion = getEnv<string>('admin-version');
  const frontVersion = getEnv<string>('front-version');

  const packages = [
    ['@nodeeweb/admin-build', adminVersion],
    ['@nodeeweb/front-build', frontVersion],
  ]
    .filter(
      ([p, v]) =>
        // not install yet
        !packageInfo.dependencies[p] ||
        // force install and not install exact version
        (store.env.FORCE_STATIC_MATCH && packageInfo.dependencies[p] !== v)
    )
    .map(([p, v]) => `${p}${v ? `@${v}` : ''}`);

  // not things to install
  if (!packages.length) return;

  logger.log(color('Green', `## Install ${packages.join(' , ')} with yarn ##`));

  const cmd = exec(`yarn add ${packages.join(' ')}`, { logger });

  await cmd;

  // dispatch package info
  dispatchPackageInfo();
}

function createSharedDir() {
  if (!fs.existsSync(getSharedPath('.'))) fs.mkdirSync(getSharedPath('.'));
}
function createPublicDir() {
  if (!fs.existsSync(getPublicDir('.', true)[0]))
    fs.mkdirSync(getPublicDir('.', true)[0]);
}

function createStaticFilesDir() {
  const [filesPath] = getPublicDir('files', true);
  const files_customerPath = path.join(filesPath, 'customer');
  const files_siteSettingPath = path.join(filesPath, 'site_setting');
  if (fs.existsSync(filesPath)) {
    logger.log('filesPath exist...');
    if (fs.existsSync(files_customerPath)) {
      logger.log('files_customerPath exist...');
    } else {
      fs.mkdir(files_customerPath, () => {
        logger.log('we created files_customerPath');
      });
    }
    if (fs.existsSync(files_siteSettingPath)) {
      logger.log('files_siteSettingPath exist...');
    } else {
      fs.mkdir(files_siteSettingPath, () => {
        logger.log('we created files_siteSettingPath');
      });
    }
  } else {
    logger.log('we should create filesPath');

    fs.mkdir(filesPath, () => {
      logger.log('we created filesPath');
      fs.mkdir(files_customerPath, () => {
        logger.log('we created files_customerPath');
      });
      fs.mkdir(files_siteSettingPath, () => {
        logger.log('we created files_siteSettingPath');
      });
    });
  }
}

async function linkIndex() {
  const source = getPublicDir('front/index.html', true)[0];
  const target = getPublicDir('files/index.html', true)[0];

  if (await isExist(target)) return;

  // remove before link
  await safeRm(target);

  // link
  await fs.promises.symlink(source, target, 'file');
}

async function copyStaticFiles(name: string) {
  const [dirLocalPath] = getStaticDir(name, true);
  const dirModulePath = getStaticDir(name, false).slice(1).filter(isExistsSync);

  // check if directory exist before
  if (isExistsSync(dirLocalPath)) {
    logger.log(name, 'folder:', dirLocalPath, ', existed');
    return;
  }

  // check if there is not any module path exists
  if (!dirModulePath.length) {
    logger.warn(
      name,
      'folder:',
      dirLocalPath,
      'not exist any where , create just empty dir'
    );
    fs.mkdirSync(dirLocalPath);
    return;
  }

  for (const dirM of dirModulePath.reverse()) {
    logger.log(`Copy ${dirM} to ${dirLocalPath}`);
    await exec(
      `${getScriptFile('mkdir')} ${dirLocalPath} && ${getScriptFile(
        'cp'
      )} ${dirM} ${dirLocalPath} `
    );
  }
  logger.log(name, 'folder:', dirLocalPath);
}

async function copyPublicFiles(name: string, condFiles: string[] = []) {
  const [dirLocalPath] = getPublicDir(name, true);
  const dirModulePath = getBuildDir(name);

  // check if directory exist before
  if (satisfyExistenceSync(dirLocalPath, ['.', ...condFiles])) {
    logger.log(name, 'folder:', dirLocalPath, ', existed');
    return;
  }

  logger.log(`Copy ${dirModulePath} to ${dirLocalPath}`);
  await exec(
    `${getScriptFile('mkdir')} ${dirLocalPath} && ${getScriptFile(
      'cp'
    )} ${dirModulePath} ${dirLocalPath} `
  );
  logger.log(name, 'folder:', dirLocalPath);
}
