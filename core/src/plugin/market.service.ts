import * as fs from 'fs';
import { MiddleWare } from '../../types/global';
import { join } from 'path';
import {
  getFilesPath,
  getLocalPluginMarketPath,
  getPluginMarketPath,
  getPluginPath,
} from '../../utils/path';
import { isExist } from '../../utils/helpers';
import { NotFound } from '../../types/error';
import { PluginMarketAddBody } from '../../dto/in/plugin.dto';
import store from '../../store';
import { FileModel } from '../../schema/file.schema';
import decompress from 'decompress';

const LOCAL_MARKET_FORMATS = ['zip', 'x-tar', 'gzip', 'x-bzip2'];

class MarketService {
  get fileModel(): FileModel {
    return store.db.model('file');
  }

  async getRealPath(...path: string[]) {
    const fromMarketPath = getPluginMarketPath(...path);
    const fromLocalPath = getLocalPluginMarketPath(...path);

    for (const p of [fromMarketPath, fromLocalPath]) {
      if (await isExist(p)) return p;
    }

    return null;
  }

  private async getAllPluginConfigPath({
    offset = 0,
    limit = Number.MAX_SAFE_INTEGER,
  }: { offset?: number; limit?: number } = {}) {
    const pluginsConfigPath = (
      await Promise.all(
        [getPluginMarketPath(), getLocalPluginMarketPath()].map(async (p) =>
          (await fs.promises.readdir(p)).map((pm) => join(p, pm))
        )
      )
    )
      .flat()
      .sort()
      .slice(offset, offset + limit)
      .map((p) => join(p, 'config.json'));

    return pluginsConfigPath;
  }

  async resolve(slug: string) {
    const pluginConfPath = await this.getRealPath(slug, 'config.json');

    if (!pluginConfPath)
      throw new NotFound(`${slug} not found in plugin market`);

    // resolve
    return await import(pluginConfPath);
  }

  getAll: MiddleWare = async (req, res) => {
    let { limit = 10, offset = 0 } = req.params;
    limit = +limit;
    offset = +offset;

    // path
    const pluginsConfigPath = await this.getAllPluginConfigPath({
      offset,
      limit,
    });

    // resolve
    const configs = await Promise.all(
      pluginsConfigPath.map((path) => import(path))
    );

    // present
    return res.json({
      data: configs.map((conf) => ({
        name: conf.name,
        description: conf.description,
        author: conf.author,
        version: conf.version,
        slug: conf.slug,
        icon: conf.icon,
        type: conf.type,
      })),
    });
  };
  getCount: MiddleWare = async (req, res) => {
    // path
    const pluginsConfigPath = await this.getAllPluginConfigPath();

    // serve
    return res.status(200).json({ data: pluginsConfigPath.length });
  };
  getOne: MiddleWare = async (req, res) => {
    // resolve
    const conf = await this.resolve(req.params.slug);

    // present
    return res.json({
      data: {
        name: conf.name,
        description: conf.description,
        author: conf.author,
        version: conf.version,
        slug: conf.slug,
        icon: conf.icon,
        type: conf.type,
        config: { inputs: conf.config.inputs },
      },
    });
  };

  add: MiddleWare = async (req, res) => {
    const body = req.body as PluginMarketAddBody;

    // file exists with correct format
    const fileDoc = await this.fileModel.findOne({
      _id: body.file,
      format: { $in: LOCAL_MARKET_FORMATS },
    });

    if (!fileDoc)
      throw new NotFound(
        `not found any acceptable file which format is in ${LOCAL_MARKET_FORMATS.join(
          ', '
        )}`
      );

    //  decompress
    await decompress(getFilesPath(fileDoc.url), getLocalPluginMarketPath());

    return res.status(201).json({
      message: 'add into local market plugin successfully',
    });
  };
}

const marketService = new MarketService();

export default marketService;
