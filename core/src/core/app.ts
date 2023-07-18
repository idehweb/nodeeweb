import express from 'express';
import { commonMiddleware, headerMiddleware } from './middleware';
import handlePlugin from '../handlers/plugin.handler';
import prepare from './prepare';
import { dbRegisterModels } from './db';
import store from '../../store';
import { dbInit } from './db';
import { setErrorPackage } from './error';
import { registerDefaultControllers } from './controller';
import { activeAuthControllers } from './auth';
import registerDefaultPlugins from './plugin';

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

  // middleware
  app.use(headerMiddleware);
  const mw = commonMiddleware();
  mw.forEach((w) => {
    if (Array.isArray(w)) {
      app.use(w[0], w[1]);
    } else app.use(w);
  });

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
