import * as fs from 'fs';
import { PluginDocument, PluginModel } from '../../schema/plugin.schema';
import store from '../../store';
import { DuplicateError, NotFound } from '../../types/error';
import { MiddleWare, Req } from '../../types/global';
import { PluginContent } from '../../types/plugin';
import { catchFn } from '../../utils/catchAsync';
import exec from '../../utils/exec';
import { call, isExist } from '../../utils/helpers';
import {
  getPluginMarketPath,
  getPluginPath,
  getScriptFile,
} from '../../utils/path';
import { validatePlain } from '../../utils/validation';
import logger from '../handlers/log.handler';
import { registerPlugin, unregisterPlugin } from '../handlers/plugin.handler';
import marketService from './market.service';
import { merge } from 'lodash';

enum PluginStep {
  CopyContent = 'copy-content',
  InsertToDB = 'insert-to-db',
  UpdateDB = 'update-db',
  Register = 'register',
}

class LocalService {
  private get from() {
    return 'CoreLocalPlugin';
  }
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

  private async validate(config: any, action: 'add' | 'edit', arg: any) {
    // validate
    if (config[action].dto) {
      const { default: dto } = await import(
        getPluginMarketPath(config.slug, config[action].dto)
      );
      arg = await validatePlain(arg, dto, true);
    }
    return arg;
  }

  async run(config: any, action: 'add' | 'edit', arg: any, validate = true) {
    // validate
    arg = validate ? await this.validate(config, action, arg) : arg;

    // execute
    const plugin = await import(getPluginPath(config.slug, config.main));
    const pluginStack: PluginContent['stack'] = await call(
      plugin[config[action].run],
      arg
    );

    return pluginStack;
  }

  private async rollback(
    steps: PluginStep[],
    {
      slug,
      plugin,
      onError,
    }: {
      slug: string;
      plugin?: PluginDocument;
      onError?: (step: PluginStep, err: any) => void;
    }
  ) {
    const core = async (step: PluginStep) => {
      switch (step) {
        case PluginStep.CopyContent:
          // rm content
          return await fs.promises.rm(getPluginPath(slug), {
            maxRetries: 5,
            force: true,
            recursive: true,
          });

        case PluginStep.InsertToDB:
          // delete doc
          return await this.pluginModel.deleteOne({ slug });

        case PluginStep.Register:
          return unregisterPlugin(slug, 'CoreLocalPlugin');

        case PluginStep.UpdateDB:
          // restore document
          return await this.pluginModel.findByIdAndUpdate(plugin._id, {
            arg: plugin.arg,
          });
      }
    };

    for (const step of steps) {
      await catchFn(core, {
        onError:
          onError?.bind(this, step) ??
          ((err: any) => {
            logger.error(`[${this.from}] rollback failed on ${step}\n`, err);
          }),
      })(step);
    }
  }
  getAllProjection() {
    return '-arg';
  }
  getOneProjection() {
    return '+arg';
  }
  getOneFilter(req: Req) {
    return { slug: req.params.slug };
  }
  getOneTransform = async (plugin: PluginDocument) => {
    // get edit config
    const conf = await this.resolve(plugin.slug);

    const newPlugin = plugin.toObject();

    delete newPlugin.arg;
    newPlugin['edit'] = { inputs: conf.edit.inputs };

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

    body = await this.validate(conf, 'add', body);

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

      const stack = await this.run(conf, 'add', body, false);

      // register
      registerPlugin(
        {
          type: conf.type,
          slug: conf.slug,
          name: conf.name,
          stack,
        },
        { from: this.from, logger }
      );

      steps.push(PluginStep.Register);

      // present
      return res.status(201).json({
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

  editPlugin: MiddleWare = async (req, res) => {
    const { slug } = req.params;
    let body = req.body,
      oldPluginDoc = await this.pluginModel.findOne({ slug });

    // check registration
    let notFoundMsg: string;
    // 1. store
    if (!store.plugin.get(slug)) notFoundMsg = 'this plugin not register yet';
    // 2. db
    else if (!oldPluginDoc)
      notFoundMsg = 'can not edit plugin which not exist in db';
    // 3. fs
    else if (!(await isExist(getPluginPath(slug))))
      notFoundMsg = `${getPluginPath(slug)} is not exist, try to add it first`;

    if (notFoundMsg) throw new NotFound(notFoundMsg);

    const steps: PluginStep[] = [];

    // resolve from local
    const conf = await this.resolve(slug);

    // verify
    body = await this.validate(conf, 'edit', body);

    try {
      // update db
      await this.pluginModel.findByIdAndUpdate(oldPluginDoc._id, {
        arg: merge(oldPluginDoc.arg, body),
      });

      steps.push(PluginStep.UpdateDB);

      const stack = await this.run(conf, 'edit', body, false);

      // register
      registerPlugin(
        {
          type: conf.type,
          slug: conf.slug,
          name: conf.name,
          stack,
        },
        { from: this.from, logger }
      );

      steps.push(PluginStep.Register);

      // present
      return res.json({
        data: {
          ...oldPluginDoc.toObject(),
          arg: undefined,
        },
      });
    } catch (err) {
      await this.rollback(steps, { slug, plugin: oldPluginDoc });
      throw err;
    }
  };

  deletePlugin: MiddleWare = async (req, res) => {
    const { slug } = req.params;

    const steps: PluginStep[] = [
      PluginStep.Register,
      PluginStep.InsertToDB,
      PluginStep.CopyContent,
    ];

    await this.rollback(steps, {
      slug,
      onError(step, err) {
        logger.error(
          `[${this.from}] delete ${slug} has error on rollback step: ${step}\n`,
          err
        );
      },
    });

    return res.status(204).send();
  };

  initPlugins = async () => {
    const plugins = await this.pluginModel.find();

    for (const plugin of plugins) {
      const conf = await this.resolve(plugin.slug);
      const stack = await this.run(conf, 'add', plugin.arg, true);

      registerPlugin(
        {
          name: plugin.name,
          slug: plugin.slug,
          type: plugin.type,
          stack,
        },
        {
          from: this.from,
        }
      );
    }
  };
}

const localService = new LocalService();

export default localService;
