import * as fs from 'fs';
import { MiddleWare } from '../../types/global';
import { join } from 'path';
import {
  getLocalPluginMarketPath,
  getPluginMarketPath,
} from '../../utils/path';
import { isExist } from '../../utils/helpers';
import { NotFound } from '../../types/error';

class MarketService {
  private async getRealPath(...path: string[]) {
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
}

const marketService = new MarketService();

export default marketService;
