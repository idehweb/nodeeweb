import * as fs from "fs";
import path from "path";
import {
  PACKAGE_PREFIX,
  getScriptFile,
  getSharedPath,
  getStaticDir,
} from "../../utils/path";
import _ from "lodash";
import { USE_ENV } from "../../types/global";
import store from "../../store";
import { log } from "../../utils/log";
import { isExistsSync } from "../../utils/helpers";
import exec from "../../utils/exec";

export default async function prepare() {
  // set custom env
  setCustomEnv();

  // create directories
  createSharedDir();
  createPublicMediaFolder();

  const staticDirs = ["plugins"];
  // run this command only if npm i nodeeweb server
  if (store.env.USE_ENV !== USE_ENV.NPM)
    staticDirs.push("schema", "theme", "admin");
  await Promise.all(staticDirs.map(createAndCopyStaticDir));
}

function setCustomEnv() {
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
}

function createSharedDir() {
  if (!fs.existsSync(getSharedPath("."))) fs.mkdirSync(getSharedPath("."));
}

function createPublicMediaFolder() {
  const [public_mediaPath] = getStaticDir("public_media", true);
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

async function createAndCopyStaticDir(name: string) {
  const [dirLocalPath] = getStaticDir(name, true);
  const dirModulePath = getStaticDir(name, false).slice(1).filter(isExistsSync);

  // check if directory exist before
  if (isExistsSync(dirLocalPath)) {
    log(dirLocalPath, " exists before");
    return;
  }

  for (const dirM of dirModulePath.reverse()) {
    log(`Copy ${dirM} to ${dirLocalPath}`);
    await exec(
      `${getScriptFile("mkdir")} ${dirLocalPath} && ${getScriptFile(
        "cp"
      )} ${dirM} ${dirLocalPath} `
    );
  }
}
