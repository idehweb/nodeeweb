import _ from 'lodash';
import path, { join } from 'path';
import fs from 'fs';
import logger from './log.handler';
import { isAsyncFunction } from 'util/types';
import { CorePluginType, PluginContent } from '../../types/plugin';
import store from '../../store';
import { color } from '../../utils/color';
import { catchFn } from '../../utils/catchAsync';
import { RegisterOptions } from '../../types/register';

export function getPluginEventName({
  content_stack,
  type,
  after,
  before,
}: {
  type: PluginContent['type'];
  after?: boolean;
  before?: boolean;
  content_stack: number;
}) {
  return `${
    after ? 'after' : before ? 'before' : 'after'
  }-plugin-${type}-${content_stack}`;
}

export default async function handlePlugin() {
  const __dirname = path.resolve();
  const pluginPath = path.join(__dirname, './plugins/');

  const plugins = (await fs.promises.readdir(pluginPath))
    .filter((p) => !p.includes('deactive'))
    .map((p) => join(pluginPath, p, 'index.js'));

  for (const plugin of plugins) {
    const pluginImport = await import(plugin);
    if (!pluginImport?.default) continue;
    // execute plugin
    logger.log('Execute Plugin : ', plugin);
    if (isAsyncFunction(pluginImport.default)) {
      await pluginImport.default();
    } else pluginImport.default();
  }
}

export function registerPlugin(
  plugin: PluginContent,
  { from, logger = store.systemLogger }: RegisterOptions
) {
  // catch
  plugin.stack = plugin.stack.map((cb, i) =>
    catchFn(
      async (...args) => {
        store.event.emit(
          getPluginEventName({
            content_stack: i,
            type: plugin.type,
            before: true,
          }),
          plugin.name,
          ...args
        );
        const response = await cb(...args);
        store.event.emit(
          getPluginEventName({
            content_stack: i,
            type: plugin.type,
            after: true,
          }),
          response,
          plugin.name,
          ...args
        );
        return response;
      },
      {
        onError(err: any) {
          logger.error(
            color(
              'Red',
              `## ${from ? `${from} ` : ''}${plugin.type}:${
                plugin.name
              } Plugin ##\n`
            ),
            err
          );
        },
      }
    )
  );

  store.plugins.set(plugin);
  logger.log(
    color(
      'Yellow',
      `## ${from ? `${from} ` : ''}Register ${plugin.type}:${
        plugin.slug
      } Plugin ##`
    )
  );
}

export function unregisterPlugin(id: string, from?: string) {
  const existBefore = store.plugins.delete(id);
  if (!existBefore) return;

  logger.log(
    color('Yellow', `## ${from ? `${from} ` : ''}Unregister ${id} Plugin ##`)
  );
}
