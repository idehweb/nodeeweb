import './src/core/loadEnv';
import store from './store';
import './src/core/setCustomEnv';
import buildApp from './src/core/app';
import logger from './src/handlers/log.handler';
import { dbConnect } from './src/core/db';
import {
  gracefullyShutdown,
  handleUncaughtException,
} from './src/core/shutdown';
import { color } from './utils/color';
import { wait } from './utils/helpers';

export default async function deployCore() {
  // handle errors
  handleUncaughtException();

  // wait for restarting
  if (store.env.RESTARTING) {
    logger.warn('waiting for restart...');
    await wait(10);
  }

  // set system logger
  store.systemLogger = logger;

  // start connect db
  await dbConnect();

  //  create express app
  const app = await buildApp();

  //   listen app
  const server = app.listen(store.env.PORT, () => {
    const address = `http://127.0.0.1:${store.env.PORT}`;
    const msg = `Server Listening at ${color('Green', address)}`;
    logger.log(msg);
  });
  store.server = server;

  // set gracefully shutdown , health path
  gracefullyShutdown();

  return store;
}
