import * as fs from 'fs';
import { PluginDocument, PluginModel } from '../../schema/plugin.schema';
import store from '../../store';
import { DuplicateError, NotFound } from '../../types/error';
import { MiddleWare, Req } from '../../types/global';
import { PluginContent } from '../../types/plugin';
import { catchFn } from '../../utils/catchAsync';
import exec from '../../utils/exec';
import { isExist } from '../../utils/helpers';
import {
  getPluginMarketPath,
  getPluginPath,
  getScriptFile,
} from '../../utils/path';
import { validatePlain } from '../../utils/validation';
import logger from '../handlers/log.handler';
import { registerPlugin, unregisterPlugin } from '../handlers/plugin.handler';
import marketService from './market.service';

enum PluginStep {
  CopyContent = 'copy-content',
  InsertToDB = 'insert-to-db',
  Register = 'register',
}

class LocalService {
  private get pluginModel(): PluginModel {
    return store.db.model('plugin');
  }
  async resolve(slug: string) {
    const pluginConfPath = getPluginPath(slug, 'config.json');

    if (!(await isExist(pluginConfPath)))
      throw new NotFound(`${slug} not found in plugin market`);

    // resolve
    return await import(pluginConfPath);
  }
  private async rollback(steps: PluginStep[], { slug }: { slug: string }) {
    const core = async (step: PluginStep) => {
      switch (step) {
        case PluginStep.CopyContent:
          // rm content
          return await fs.promises.rmdir(getPluginPath(slug), {
            maxRetries: 5,
          });

        case PluginStep.InsertToDB:
          // delete doc
          return await this.pluginModel.deleteOne({ slug });

        case PluginStep.Register:
          return unregisterPlugin(slug, 'CoreLocalPlugin');
      }
    };

    for (const step of steps) {
      await catchFn(core, {
        onError(err: any) {
          logger.error(`[PluginLocal] rollback failed on ${step}\n`, err);
        },
      })(step);
    }
  }
  getAllProjection() {
    return '-args';
  }
  getOneProjection() {
    return '+args';
  }
  getOneFilter(req: Req) {
    return { slug: req.params.slug };
  }
  getOneTransform = async (plugin: PluginDocument) => {
    // get edit config
    const conf = await this.resolve(plugin.slug);

    const newPlugin = plugin.toObject();

    delete newPlugin.arg;
    newPlugin['edit'] = { inputs: conf.edit };

    // fill value
    for (const editInput of newPlugin['edit'].inputs) {
      editInput.value = plugin.arg[editInput.key];
    }

    // present
    return newPlugin;
  };

  addPlugin: MiddleWare = async (req, res) => {
    const { slug } = req.params;
    let body = req.body;

    // check registration
    let dupMsg: string;
    // 1. store
    if (store.plugin.get(slug)) dupMsg = 'this plugin added before';
    // 2. db
    else if (await this.pluginModel.findOne({ slug }))
      dupMsg = 'can not add plugin to db twice';
    // 3. fs
    else if (await isExist(getPluginPath(slug)))
      dupMsg = `${getPluginPath(
        slug
      )} is already exists, try to remove it first`;

    if (dupMsg) throw new DuplicateError(dupMsg);

    const steps: PluginStep[] = [];

    // resolve from market
    const conf = await marketService.resolve(slug);

    // validate
    if (conf.add.dto) {
      const { default: addDto } = await import(
        getPluginMarketPath(slug, conf.add.dto)
      );
      body = await validatePlain(body, addDto, true);
    }
    try {
      // copy files
      await exec(
        `${getScriptFile('cp')} ${getPluginMarketPath(slug)} ${getPluginPath(
          slug
        )}`,
        { logger }
      );

      steps.push(PluginStep.CopyContent);

      // save to db
      const pluginDoc = await this.pluginModel.create({
        ...conf,
        arg: body,
      });

      steps.push(PluginStep.InsertToDB);

      // resolve and call runner plugin
      const plugin = await import(getPluginPath(slug, conf.main));
      const pluginStack: PluginContent['stack'] = await plugin[conf.add.run](
        body
      );

      // register
      registerPlugin(
        {
          type: conf.type,
          slug: conf.slug,
          name: conf.name,
          stack: pluginStack,
        },
        { from: 'CoreLocalPlugin', logger }
      );

      steps.push(PluginStep.Register);

      // present
      return res.json({
        data: {
          ...pluginDoc.toObject(),
          arg: undefined,
        },
      });
    } catch (err) {
      await this.rollback(steps, { slug });
      throw err;
    }
  };
}

const localService = new LocalService();

export default localService;
