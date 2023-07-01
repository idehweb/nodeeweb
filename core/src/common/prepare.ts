import * as fs from "fs";
import path from "path";
import {
  PACKAGE_PREFIX,
  getScriptFile,
  getSharedPath,
  getStaticDir,
} from "../../utils/path";
import { USE_ENV } from "../../types/global";
import store from "../../store";
import { log } from "../../utils/log";
import { isExistsSync } from "../../utils/helpers";
import exec from "../../utils/exec";

export default async function prepare() {
  // set use env
  setUseEnv();

  // create directories
  createSharedDir();
  createPublicMediaFolder();
  createPluginFolder();
  createSchemaFolder();
  await createThemeFolder();
  await createAdminFolder();
}

function setUseEnv() {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath);

  const node_modules_ns = resolveApp(PACKAGE_PREFIX);
  if (fs.existsSync(node_modules_ns)) store.env.USE_ENV = USE_ENV.NPM;
  else store.env.USE_ENV = USE_ENV.GIT;
}

function createSharedDir() {
  if (!fs.existsSync(getSharedPath("."))) fs.mkdirSync(getSharedPath("."));
}

function createPublicMediaFolder() {
  const public_mediaPath = getStaticDir("public_media");
  const public_media_customerPath = path.join(public_mediaPath, "customer");
  const public_media_siteSettingPath = path.join(
    public_mediaPath,
    "site_setting"
  );
  if (fs.existsSync(public_mediaPath)) {
    log("public_mediaPath exist...");
    if (fs.existsSync(public_media_customerPath)) {
      log("public_media_customerPath exist...");
    } else {
      fs.mkdir(public_media_customerPath, () => {
        log("we created public_media_customerPath");
      });
    }
    if (fs.existsSync(public_media_siteSettingPath)) {
      log("public_media_siteSettingPath exist...");
    } else {
      fs.mkdir(public_media_siteSettingPath, () => {
        log("we created public_media_siteSettingPath");
      });
    }
  } else {
    log("we should create public_mediaPath");

    fs.mkdir(public_mediaPath, () => {
      log("we created public_mediaPath");
      fs.mkdir(public_media_customerPath, () => {
        log("we created public_media_customerPath");
      });
      fs.mkdir(public_media_siteSettingPath, () => {
        log("we created public_media_siteSettingPath");
      });
    });
  }
}

async function createAdminFolder() {
  // run this command only if npm i nodeeweb server
  if (store.env.USE_ENV !== USE_ENV.NPM) return;

  const adminLocalPath = getStaticDir("admin");
  const adminModulePath = getStaticDir("admin", true);

  // check if directory exist before
  if (isExistsSync(adminLocalPath)) {
    log(adminLocalPath, " exists before");
    return;
  }
  const cmd = `${getScriptFile("mkdir")} ${adminLocalPath} && ${getScriptFile(
    "cp"
  )} ${adminModulePath} ${adminLocalPath} `;

  await exec(cmd);
}

async function createThemeFolder() {
  // run this command only if npm i nodeeweb server
  if (store.env.USE_ENV !== USE_ENV.NPM) return;

  const themeLocalPath = getStaticDir("theme");
  const themeModulePath = getStaticDir("theme", true);

  // check if directory exist before
  if (isExistsSync(themeLocalPath)) {
    log(themeLocalPath, " exists before");
    return;
  }

  await exec(
    `${getScriptFile("mkdir")} ${themeLocalPath} && ${getScriptFile(
      "cp"
    )} ${themeModulePath} ${themeLocalPath} `
  );
}
function createPluginFolder() {
  const pluginPath = getStaticDir("plugins");
  if (!isExistsSync(pluginPath)) fs.mkdirSync(pluginPath);
}
function createSchemaFolder() {
  const schemaPath = getStaticDir("schema");
  if (!isExistsSync(schemaPath)) fs.mkdirSync(schemaPath);
}
