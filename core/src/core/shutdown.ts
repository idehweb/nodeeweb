import { createTerminus } from '@godaddy/terminus';
import mongoose from 'mongoose';
import logger from '../handlers/log.handler';
import store from '../../store';
import { clearAllLockFiles } from '../handlers/singleJob.handler';

export function handleUncaughtException() {
  process.once('uncaughtException', (err) => {
    logger.error('#uncaughtException:', err);
    shutdown(1);
  });
  process.once('unhandledRejection', (err) => {
    logger.error('#unhandledRejection:', err);
    shutdown(1);
  });
}

export function gracefullyShutdown() {
  createTerminus(store.server, {
    healthChecks: { '/health': onHealthcheck },
    onSignal,
    signals: ['SIGINT', 'SIGTERM'],
    useExit0: true,
  });
}

export function shutdown(code = 0) {
  store.server?.close(async () => {
    try {
      await onSignal();
      clearAllLockFiles();
    } catch (err) {}
    process.exit(code);
  });
}
async function onSignal() {
  await Promise.all(mongoose.connections.map((c) => c.close()));
}
async function onHealthcheck() {
  const status = mongoose.connections.every((c) => c.readyState === 1);
  if (!status) throw new Error('DB not connect yet!');
}
