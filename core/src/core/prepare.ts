import * as fs from 'fs';
import path, { join } from 'path';
import {
  PACKAGE_PREFIX,
  getBuildDir,
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

export default async function prepare() {
  // install requirements
  await installRequirements();

  // create directories
  createSharedDir();
  createPublicMediaFolder();

  // link
  await createAndCopyBuildDir('admin');

  const staticDirs = ['plugins'];
  // run this command only if npm i @nodeeweb/core
  if (store.env.USE_ENV === USE_ENV.NPM) staticDirs.push('schema', 'theme');
  await Promise.all(staticDirs.map(createAndCopyStaticDir));
}

async function installRequirements() {
  if (store.env.NOT_INSTALL_REQUIREMENTS || store.env.USE_ENV !== USE_ENV.NPM)
    return;

  const packageInfo = await import(path.join(path.resolve(), 'package.json'));
  const requirements = ['mongoose', 'bcrypt'].filter(
    (pack) => !packageInfo.dependencies[pack]
  );
  if (!requirements.length) return;
  logger.log(color('Green', `## Install ${requirements.join(', ')} ##`));
  await exec(`npm i ${requirements.join(' ')}`);
}

function createSharedDir() {
  if (!fs.existsSync(getSharedPath('.'))) fs.mkdirSync(getSharedPath('.'));
}

function createPublicMediaFolder() {
  const [public_mediaPath] = getStaticDir('public_media', true);
  const public_media_customerPath = path.join(public_mediaPath, 'customer');
  const public_media_siteSettingPath = path.join(
    public_mediaPath,
    'site_setting'
  );
  if (fs.existsSync(public_mediaPath)) {
    logger.log('public_mediaPath exist...');
    if (fs.existsSync(public_media_customerPath)) {
      logger.log('public_media_customerPath exist...');
    } else {
      fs.mkdir(public_media_customerPath, () => {
        logger.log('we created public_media_customerPath');
      });
    }
    if (fs.existsSync(public_media_siteSettingPath)) {
      logger.log('public_media_siteSettingPath exist...');
    } else {
      fs.mkdir(public_media_siteSettingPath, () => {
        logger.log('we created public_media_siteSettingPath');
      });
    }
  } else {
    logger.log('we should create public_mediaPath');

    fs.mkdir(public_mediaPath, () => {
      logger.log('we created public_mediaPath');
      fs.mkdir(public_media_customerPath, () => {
        logger.log('we created public_media_customerPath');
      });
      fs.mkdir(public_media_siteSettingPath, () => {
        logger.log('we created public_media_siteSettingPath');
      });
    });
  }
}

async function createAndCopyStaticDir(name: string) {
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

async function createAndCopyBuildDir(name: string) {
  const [dirLocalPath] = getStaticDir(name, true);
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
