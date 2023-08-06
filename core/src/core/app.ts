import express from 'express';
import 'reflect-metadata';
import { registerCommonHandlers } from './middleware';
import prepare from './prepare';
import { dbRegisterModels } from './db';
import store from '../../store';
import { dbInit } from './db';
import { setErrorPackage } from './error';
import { registerDefaultControllers } from './controller';
import { activeAuthControllers } from './auth';
import registerDefaultPlugins from './plugin';
import { registerValidationPipe } from '../handlers/validate.handler';

const app = express();

app.disable('x-powered-by');

store.app = app;

export default async function buildApp() {
  // prepare , create dirs
  await prepare();

  // register models
  await dbRegisterModels();

  // initial first records in db
  await dbInit();

  // error
  setErrorPackage();

  // validate
  registerValidationPipe();

  // common
  registerCommonHandlers();

  // plugins
  // await handlePlugin();

  // auth controllers
  activeAuthControllers();

  // default controller
  registerDefaultControllers();

  // default plugins
  registerDefaultPlugins();

  return app;
}
