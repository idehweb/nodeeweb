import express from 'express';
import 'reflect-metadata';
import { commonMiddleware, headerMiddleware } from './middleware';
import prepare from './prepare';
import { dbRegisterModels } from './db';
import store from '../../store';
import { dbInit } from './db';
import { setErrorPackage } from './error';
import { registerDefaultControllers } from './controller';
import { activeAuthControllers } from './auth';
import registerDefaultPlugins from './plugin';
import { registerValidationPipe } from '../handlers/validate.handler';
import { renderViewControllers } from './view';

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

  // middleware
  app.use(headerMiddleware);
  const mw = commonMiddleware();
  mw.forEach((w) => {
    if (Array.isArray(w)) {
      app.use(w[0], w[1]);
    } else app.use(w);
  });

  // view
  renderViewControllers();

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
