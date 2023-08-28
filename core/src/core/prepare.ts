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
import { isExistsSync } from '../../utils/helpers';
import exec from '../../utils/exec';
import { color } from '../../utils/color';
import { APP_INFO, CORE_NODE_MODULE_PATH_RELATIVE } from '../../utils/package';

export default async function prepare() {
  // install requirements
  await installRequirements();

  // create directories
  createSharedDir();
  createPublicDir();
  createPublicMediaFolder();

  // copy public files
  await copyPublicFiles('admin');
  await copyPublicFiles('front');

  // copy static dirs
  await copyStaticFiles('schema');
}

async function installRequirements() {
  if (store.env.NOT_INSTALL_REQUIREMENTS || store.env.USE_ENV !== USE_ENV.NPM)
    return;

  const packageInfo = await import(APP_INFO);

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
}

function createSharedDir() {
  if (!fs.existsSync(getSharedPath('.'))) fs.mkdirSync(getSharedPath('.'));
}
function createPublicDir() {
  if (!fs.existsSync(getPublicDir('.', true)[0]))
    fs.mkdirSync(getPublicDir('.', true)[0]);
}

function createPublicMediaFolder() {
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

async function copyPublicFiles(name: string) {
  const [dirLocalPath] = getPublicDir(name, true);
  const dirModulePath = getBuildDir(name);

  // check if directory exist before
  if (isExistsSync(dirLocalPath)) {
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
