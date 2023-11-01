import mongoose from 'mongoose';
import fs from 'fs';
import store from '../../store';
import logger from '../handlers/log.handler';
import global from '../global';
import { SingleJobProcess } from '../handlers/singleJob.handler';
import { getSchemaDir } from '../../utils/path';
import { join } from 'path';
import { color } from '../../utils/color';
import _ from 'lodash';

export async function dbConnect() {
  const db = await mongoose.connect(store.env.MONGO_URL, {
    dbName: store.env.DB_NAME,
  });
  store.db = db;
  logger.log('DB connected');
}
export async function dbDisconnect() {
  if (!store.db) return;
  await store.db.disconnect();
}
export async function dbInit() {
  await SingleJobProcess.builderAsync('initial-db', async () => {
    // check admin
    const adminModel = store.db.model('admin');
    const admin = await adminModel.findOne();
    if (!admin) {
      logger.log("there is not any admin, let's insert some...");
      await adminModel.create({
        email: store.env.ADMIN_EMAIL ?? 'admin@example.com',
        username: store.env.ADMIN_USERNAME ?? 'admin',
        nickname: store.env.ADMIN_USERNAME ?? 'admin',
        password: store.env.ADMIN_PASSWORD ?? 'admin',
        role: 'owner',
      });
    }

    // check setting
    const settingModel = store.db.model('setting');
    const setting = await settingModel.findOne({});
    if (!setting) {
      logger.log("there is not any setting, let's insert some...");
      await settingModel.create({});
    }
  })();
}

export async function dbRegisterModels() {
  // read dir
  const schemaDir = getSchemaDir();
  const schemaFiles = fs
    .readdirSync(schemaDir)
    .filter((name) => !name.startsWith('_') && !name.endsWith('.d.ts'))
    .sort()
    .map((sp) => [sp.split('.')[0].split('-').pop(), join(schemaDir, sp)]);

  logger.log(color('Green', `## Start Register Models... ##`));
  // import
  await Promise.all(
    schemaFiles.map(async ([name, schemaFile]) => {
      const { default: schema } = await import(schemaFile);
      store.db.model(name, schema);
      logger.log(color('Green', `## Register ${_.startCase(name)} Model ##`));
    })
  );
  // for (const [name, schemaFile] of schemaFiles) {
  //   const { default: schema } = await import(schemaFile);
  //   store.db.model(name, schema);
  //   logger.log(color("Green", `## Register ${_.startCase(name)} Model ##`));
  // }
}

export async function dbSyncIndex() {
  // await store.db.syncIndexes();
}
