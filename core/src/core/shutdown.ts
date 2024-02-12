import { createTerminus } from '@godaddy/terminus';
import mongoose from 'mongoose';
import logger from '../handlers/log.handler';
import store from '../../store';
import {
  clearAllLockFiles,
  waitForLockFiles,
} from '../handlers/singleJob.handler';

export function handleUncaughtException() {
  process.removeAllListeners('uncaughtException');
  process.removeAllListeners('unhandledRejection');

  process.on('uncaughtException', (err) => {
    logger.error('#uncaughtException:', err);
    shutdown(1);
  });
  process.on('unhandledRejection', (err) => {
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

export async function shutdown(code = 0) {
  const finalStep = async () => {
    try {
      await onSignal();
    } catch (err) {
      logger.error('onSignal error', err);
    }
    process.exit(code);
  };

  if (!store.server) return await finalStep();
  store.server.close(finalStep);
}

async function onSignal() {
  try {
    await Promise.all(mongoose.connections.map((c) => c.close()));
  } catch (err) {
    logger.error('mongoose connection close error', err);
  }

  try {
    await waitForLockFiles(5);
  } catch (err) {
    logger.error('wait for lock files error', err);
  }
}
async function onHealthcheck() {
  const status = mongoose.connections.every((c) => c.readyState === 1);
  if (!status) throw new Error('DB not connect yet!');
}
