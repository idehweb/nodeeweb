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
import { FileDocument, FileModel } from '../../schema/file.schema';
import decompress from 'decompress';
import { randomUUID } from 'crypto';

const LOCAL_MARKET_FORMATS = ['zip', 'x-tar', 'gzip', 'x-bzip2'];

class MarketService {
  private transformOut(pluginConfig: any, exclude: string[] = []) {
    const out = {
      name: pluginConfig.name,
      description: pluginConfig.description,
      author: pluginConfig.author,
      version: pluginConfig.version,
      slug: pluginConfig.slug,
      icon: pluginConfig.icon,
      type: pluginConfig.type,
      config: { inputs: pluginConfig.config.inputs },
    };

    exclude.forEach((k) => delete out[k]);
    return out;
  }
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
      data: configs.map((conf) => this.transformOut(conf, ['config'])),
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
      data: this.transformOut(conf),
    });
  };

  private async processFile(fileDoc: FileDocument) {
    const tmpRootPath = getLocalPluginMarketPath(randomUUID());
    await decompress(getFilesPath(fileDoc.url), tmpRootPath);
    const configObj = JSON.parse(
      await fs.promises.readFile(join(tmpRootPath, 'config.json'), 'utf8')
    );
    const slug = configObj.slug;
    const rootPath = getLocalPluginMarketPath(slug);
    if (await isExist(rootPath))
      // remove dest
      await fs.promises.rm(rootPath, { recursive: true });

    await fs.promises.rename(tmpRootPath, rootPath);
    return configObj;
  }

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

    //  process
    const plugin = await this.processFile(fileDoc);

    return res.status(201).json({
      data: this.transformOut(plugin),
      message: `add ${plugin.slug} into local market plugin successfully`,
    });
  };
}

const marketService = new MarketService();

export default marketService;
