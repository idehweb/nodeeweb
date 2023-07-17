import _ from 'lodash';
import path, { join } from 'path';
import fs from 'fs';
import logger from './log.handler';
import { isAsyncFunction } from 'util/types';
import { PluginContent, PluginType } from '../../types/plugin';
import store from '../../store';
import { color } from '../../utils/color';

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
  type: PluginType,
  content: PluginContent,
  from?: string
) {
  store.plugins.set(type, content);
  logger.log(
    color(
      'Yellow',
      `## ${from ? `${from} ` : ''}Register ${type}:${content.name} Plugin ##`
    )
  );
}
