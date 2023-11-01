import express from 'express';
import 'reflect-metadata';
import { registerCommonHandlers } from './middleware';
import prepare from './prepare';
import { dbRegisterModels, dbSyncIndex } from './db';
import store from '../../store';
import { dbInit } from './db';
import { setErrorPackage } from './error';
import { registerDefaultControllers } from './controller';
import { activeAuthControllers } from './auth';
import { registerValidationPipe } from '../handlers/validate.handler';
import { registerDefaultConfig } from '../config/config';
import { registerDefaultEvent } from './event';
import { initPlugins } from '../plugin';
import { initRoutes } from './view';
import initSupervisor from '../supervisor';
import initSeo from '../seo';

const app = express();

app.disable('x-powered-by');
store.env.MAX_NUM_OF_PROXY &&
  app.set('trust proxy', store.env.MAX_NUM_OF_PROXY);

store.app = app;

export default async function buildApp() {
  // prepare , create dirs
  await prepare();

  // register config
  registerDefaultConfig();

  // register event
  registerDefaultEvent();

  // supervisor;
  initSupervisor();

  // register models
  await dbRegisterModels();

  // sync index
  await dbSyncIndex();

  // initial first records in db , do some initial stuff
  await dbInit();

  // error
  setErrorPackage();

  // validate
  registerValidationPipe();

  // common
  registerCommonHandlers();

  // auth controllers
  activeAuthControllers();

  // seo
  initSeo();

  // default controller
  registerDefaultControllers();

  // plugins
  await initPlugins();

  // routes
  await initRoutes();

  return app;
}
