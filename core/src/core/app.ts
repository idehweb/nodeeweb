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
import { registerValidationPipe } from '../handlers/validate.handler';
import { registerDefaultConfig } from '../config/config';
import { registerDefaultEvent } from './event';
import { registerPluginControllers } from '../plugin/controller';
import { initPlugins } from '../plugin';

const app = express();

app.disable('x-powered-by');

store.app = app;

export default async function buildApp() {
  // prepare , create dirs
  await prepare();

  // register config
  registerDefaultConfig();

  // register event
  registerDefaultEvent();

  // register models
  await dbRegisterModels();

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

  // default controller
  registerDefaultControllers();

  // plugins
  await initPlugins();

  return app;
}
