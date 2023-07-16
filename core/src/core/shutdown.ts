import { createTerminus } from '@godaddy/terminus';
import mongoose from 'mongoose';
import logger from '../handlers/log.handler';
import store from '../../store';

export function handleUncaughtException() {
  process.once('uncaughtException', (err) => {
    logger.error('#uncaughtException:', err);
    shutdown();
  });
  process.once('unhandledRejection', (err) => {
    logger.error('#unhandledRejection:', err);
    shutdown();
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

function shutdown() {
  store.server?.close(async () => {
    try {
      await onSignal();
    } catch (err) {}
    process.exit(1);
  });
}
async function onSignal() {
  await Promise.all(mongoose.connections.map((c) => c.close()));
}
async function onHealthcheck() {
  const status = mongoose.connections.every((c) => c.readyState === 1);
  if (!status) throw new Error('DB not connect yet!');
}
