import { PluginDocument, PluginModel } from '../../schema/plugin.schema';
import store from '../../store';
import { DuplicateError, NotFound } from '../../types/error';
import { MiddleWare, Req } from '../../types/global';
import { PluginContent } from '../../types/plugin';
import exec from '../../utils/exec';
import { isExist } from '../../utils/helpers';
import {
  getPluginMarketPath,
  getPluginPath,
  getScriptFile,
} from '../../utils/path';
import { validatePlain } from '../../utils/validation';
import logger from '../handlers/log.handler';
import { registerPlugin } from '../handlers/plugin.handler';
import marketService from './market.service';

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
      dupMsg =
        'plugin directory already have plugin content, try to remove them first';

    if (dupMsg) throw new DuplicateError(dupMsg);

    // resolve from market
    const conf = await marketService.resolve(slug);

    // validate
    if (conf.add.dto) {
      const { default: addDto } = await import(
        getPluginMarketPath(slug, conf.add.dto)
      );
      body = await validatePlain(body, addDto, true);
    }

    // copy files
    await exec(
      `${getScriptFile('cp')} ${getPluginMarketPath(slug)} ${getPluginPath()}`,
      { logger }
    );

    // save to db
    const pluginDoc = await this.pluginModel.create({
      ...conf,
      arg: body,
    });

    // resolve and call runner plugin
    const plugin = await import(getPluginPath(slug, conf.main));
    const pluginStack: PluginContent['stack'] = await plugin[conf.add.run](
      body
    );

    // register
    registerPlugin(
      { type: conf.type, slug: conf.slug, name: conf.name, stack: pluginStack },
      { from: 'CoreLocalPlugin', logger }
    );

    // present
    return res.json({
      data: {
        ...pluginDoc.toObject(),
        arg: undefined,
      },
    });
  };
}

const localService = new LocalService();

export default localService;
