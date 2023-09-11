import * as fs from 'fs';
import {
  PluginDocument,
  PluginModel,
  PluginStatus,
} from '../../schema/plugin.schema';
import store from '../../store';
import {
  BadRequestError,
  DuplicateError,
  NotFound,
  SimpleError,
} from '../../types/error';
import { MiddleWare, Req } from '../../types/global';
import { PluginContent } from '../../types/plugin';
import { catchFn } from '../../utils/catchAsync';
import exec from '../../utils/exec';
import { axiosError2String, call, isExist } from '../../utils/helpers';
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
import { PluginConfig } from './plugin';

enum PluginStep {
  CopyContent = 'copy-content',
  InsertToDB = 'insert-to-db',
  Config = 'config',
  UpdateDB = 'update-db',
  Register = 'register',
  UnRegister = 'unregister',
}

class LocalService {
  private get from() {
    return 'CoreLocalPlugin';
  }

  private insidePluginLib = {
    logger,
    systemLogger: store.systemLogger,
    SimpleError,
    axiosError2String,
    getEnv: (key: string) => {
      return store.env[key];
    },
  };

  private insideResolve = (key: string) => {
    return this.insidePluginLib[key];
  };

  private get pluginModel(): PluginModel {
    return store.db.model('plugin');
  }
  async resolve(slug: string): Promise<PluginConfig> {
    const pluginConfPath = getPluginPath(slug, 'config.json');

    if (!(await isExist(pluginConfPath)))
      throw new NotFound(`${slug} not found in local plugins`);

    // resolve
    return await import(pluginConfPath);
  }

  private async validate(
    config: PluginConfig,
    action: 'config' | 'edit' | 'active',
    arg: any
  ) {
    // validate
    if (!config[action]?.dto && action === 'active') action = 'config';

    if (config[action]?.dto) {
      const { default: dto } = await import(
        getPluginMarketPath(config.slug, config[action].dto)
      );
      arg = await validatePlain(arg, dto, true);
    }
    return arg;
  }

  async run(
    config: PluginConfig,
    action: 'active' | 'config' | 'edit',
    arg: any,
    validate = true
  ) {
    // validate
    arg = validate ? await this.validate(config, action, arg) : arg;

    if (action === 'active' && !config[action]?.run) action = 'config';

    // execute
    const plugin = await import(getPluginPath(config.slug, config.main));
    const pluginStack: PluginContent['stack'] = await call(
      plugin[config[action].run],
      { ...arg, resolve: this.insideResolve }
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

    let key: 'edit' | 'config';
    if (newPlugin.status === PluginStatus.NeedToConfig) key = 'config';
    else key = 'edit';

    newPlugin[key] = { inputs: conf[key].inputs };

    // fill value
    if (key === 'edit')
      for (const input of newPlugin[key].inputs)
        input.value = plugin.arg[input.key];

    // present
    return newPlugin;
  };

  addPlugin: MiddleWare = async (req, res) => {
    const { slug } = req.params;
    let body = req.body;

    // check registration
    let dupMsg: string;
    // 1. store
    if (store.plugins.get(slug)) dupMsg = 'this plugin added before';
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

    body = await this.validate(conf, 'add' as any, body);

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

      const stack = await this.run(conf, 'add' as any, body, false);

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

  install: MiddleWare = async (req, res) => {
    const { slug } = req.params;

    // check registration
    let dupMsg: string;
    // 1. store
    if (store.plugins.get(slug)) dupMsg = 'this plugin added before';
    // 2. db
    else if (await this.pluginModel.findOne({ slug }))
      dupMsg = 'can not add plugin to db twice';
    // 3. fs
    else if (await isExist(getPluginPath(slug)))
      dupMsg = `${getPluginPath(
        slug
      )} is already exists, try to remove it first`;

    if (dupMsg) throw new DuplicateError(dupMsg);

    // resolve from market
    const conf = await marketService.resolve(slug);

    // copy files
    await exec(
      `${getScriptFile('cp')} ${getPluginMarketPath(slug)} ${getPluginPath(
        slug
      )}`,
      { logger }
    );

    // save to db
    const pluginDoc = await this.pluginModel.create({
      ...conf,
      status: PluginStatus.NeedToConfig,
    });

    // present
    return res.status(201).json({
      data: {
        ...pluginDoc.toObject(),
        arg: undefined,
      },
    });
  };

  config: MiddleWare = async (req, res) => {
    const { slug } = req.params;
    let body = req.body;

    const plugin = await this.pluginModel.findOne({
      slug,
      status: PluginStatus.NeedToConfig,
    });

    // check registration
    let dupMsg: string;

    // 1. store
    if (store.plugins.get(slug)) dupMsg = 'this plugin config before';
    if (dupMsg) throw new DuplicateError(dupMsg);

    // not found

    // db, fs
    if (!plugin || !(await isExist(getPluginPath(slug))))
      throw new NotFound('plugin not found');

    // resolve from local
    const conf = await localService.resolve(slug);
    body = await this.validate(conf, 'config', body);

    // save to db
    const pluginDoc = await this.pluginModel.findOneAndUpdate(
      { slug },
      {
        arg: body,
        status: PluginStatus.Active,
      },
      {
        new: true,
      }
    );

    const stack = await this.run(conf, 'config', body, false);

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

    // present
    return res.status(200).json({
      data: {
        ...pluginDoc.toObject(),
        arg: undefined,
      },
    });
  };

  editPlugin: MiddleWare = async (req, res) => {
    const { slug } = req.params;
    let body = req.body,
      oldPluginDoc = await this.pluginModel.findOne({
        slug,
        status: { $in: [PluginStatus.Active, PluginStatus.Inactive] },
      });

    if (!oldPluginDoc) throw new NotFound('plugin not found');

    // activation
    if (body.status) {
      const wantActive =
        body.status === PluginStatus.Active &&
        oldPluginDoc.status === PluginStatus.Inactive;

      const wantInactive =
        body.status === PluginStatus.Inactive &&
        oldPluginDoc.status === PluginStatus.Active;

      if (!wantActive && !wantInactive)
        throw new BadRequestError('status must be deferent');

      const newPluginDoc = await this.pluginModel.findOneAndUpdate(
        { slug },
        { status: body.status },
        { new: true }
      );

      if (wantActive) {
        // active
        const conf = await this.resolve(slug);
        const stack = await this.run(conf, 'active', newPluginDoc.arg);

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
      }
      if (wantInactive) {
        // inactive
        unregisterPlugin(slug, this.from);
      }

      return res
        .status(200)
        .json({ ...newPluginDoc.toObject(), args: undefined });
    }

    if (body.config) {
      // change config

      // resolve from local
      const conf = await this.resolve(slug);

      // verify
      const editConf = await this.validate(conf, 'edit', body.config);
      // update db
      const newPluginDoc = await this.pluginModel.findByIdAndUpdate(
        oldPluginDoc._id,
        {
          arg: merge(oldPluginDoc.arg, editConf),
        },
        {
          new: true,
        }
      );

      if (oldPluginDoc.status === PluginStatus.Active) {
        const stack = await this.run(conf, 'edit', editConf, false);
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
      }

      // present
      return res.json({
        data: newPluginDoc,
      });
    }
  };

  uninstall: MiddleWare = async (req, res) => {
    const { slug } = req.params;

    const plugin = await this.pluginModel.findOne({ slug });

    const steps: PluginStep[] = [PluginStep.InsertToDB, PluginStep.CopyContent];

    if (plugin?.status === PluginStatus.Active) {
      steps.push(PluginStep.Register);
    }

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
    const plugins = await this.pluginModel.find({
      status: PluginStatus.Active,
    });

    for (const plugin of plugins) {
      const conf = await this.resolve(plugin.slug);
      const stack = await this.run(conf, 'active', plugin.arg, true);

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
